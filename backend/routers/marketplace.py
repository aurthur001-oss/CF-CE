from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from database import SessionLocal

router = APIRouter(
    prefix="/marketplace",
    tags=["Marketplace"],
    responses={404: {"description": "Not found"}},
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/items/", response_model=List[schemas.MarketplaceItem])
def read_marketplace_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.MarketplaceItem).offset(skip).limit(limit).all()

@router.post("/items/", response_model=schemas.MarketplaceItem)
def create_marketplace_item(item: schemas.MarketplaceItemCreate, seller_id: int, db: Session = Depends(get_db)):
    db_item = models.MarketplaceItem(
        seller_id=seller_id,
        name=item.name,
        category=item.category,
        description=item.description,
        price=item.price,
        stock_quantity=item.stock_quantity,
        image_url=item.image_url
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.post("/orders/", response_model=schemas.MarketplaceOrder)
def create_marketplace_order(order: schemas.MarketplaceOrderCreate, buyer_id: int, db: Session = Depends(get_db)):
    item = db.query(models.MarketplaceItem).filter(models.MarketplaceItem.id == order.item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
        
    if item.stock_quantity < order.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")
        
    total_price = item.price * order.quantity
    
    db_order = models.MarketplaceOrder(
        item_id=order.item_id,
        buyer_id=buyer_id,
        quantity=order.quantity,
        total_price=total_price,
        status="PENDING"
    )
    
    # Update Stock
    item.stock_quantity -= order.quantity
    
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order
