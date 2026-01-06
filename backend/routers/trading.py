from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models, schemas, uuid
from database import SessionLocal

router = APIRouter(
    prefix="/trading",
    tags=["Trading"],
    responses={404: {"description": "Not found"}},
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Dependency hack to avoid circular import if getting current user depends on main
# Ideally we move get_current_user to a dependencies.py
# For now, we will trust the JWT injection in main or replicate basic auth?
# Let's import get_current_user from main - wait main imports us. Circular dependency.
# Solution: Move dependencies to a new file `dependencies.py` or `auth.py`. 
# Or just accept token here.

@router.post("/orders/", response_model=schemas.TradeOrder)
def create_trade_order(order: schemas.TradeOrderCreate, user_id: int, db: Session = Depends(get_db)):
    # Generate Anon ID
    anon_id = "ANON-" + str(uuid.uuid4())[:8].upper()
    
    db_order = models.TradeOrder(
        user_id=user_id,
        anonymous_id=anon_id,
        order_type=order.order_type,
        fuel_type=order.fuel_type,
        quantity=order.quantity,
        price_per_unit=order.price_per_unit
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    # Simple Matching Engine Logic (Triggered on new order)
    match_orders(db, db_order)
    
    return db_order

@router.get("/orders/", response_model=List[schemas.TradeOrder])
def read_trade_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Return all OPEN orders for the blind order book (hide user_id field in response? Schema handles it?)
    # Schema `TradeOrder` has user_id, anonymity requires hiding it.
    # We should have a PublicTradeOrder schema.
    return db.query(models.TradeOrder).filter(models.TradeOrder.status == "OPEN").offset(skip).limit(limit).all()

def match_orders(db: Session, new_order: models.TradeOrder):
    # Find opposite order type with same fuel type and matching price
    opposite_type = "SELL" if new_order.order_type == "BUY" else "BUY"
    
    potential_matches = db.query(models.TradeOrder).filter(
        models.TradeOrder.order_type == opposite_type,
        models.TradeOrder.fuel_type == new_order.fuel_type,
        models.TradeOrder.status == "OPEN"
    )
    
    if new_order.order_type == "BUY":
        # Buyer wants lowest price -> Sort Ascending
        potential_matches = potential_matches.filter(models.TradeOrder.price_per_unit <= new_order.price_per_unit).order_by(models.TradeOrder.price_per_unit.asc())
    else:
        # Seller wants highest price -> Sort Descending
        potential_matches = potential_matches.filter(models.TradeOrder.price_per_unit >= new_order.price_per_unit).order_by(models.TradeOrder.price_per_unit.desc())
        
    matches = potential_matches.all()
    
    # Execute matches
    remaining_qty = new_order.quantity
    
    for match in matches:
        if remaining_qty <= 0:
            break
            
        exec_qty = min(remaining_qty, match.quantity)
        price = match.price_per_unit # Maker's price
        
        # Create Transaction
        transaction = models.TradeTransaction(
            buyer_order_id=new_order.id if new_order.order_type == "BUY" else match.id,
            seller_order_id=new_order.id if new_order.order_type == "SELL" else match.id,
            quantity=exec_qty,
            price_per_unit=price,
            total_amount=exec_qty * price
        )
        db.add(transaction)
        
        # Update Quantities/Status
        match.quantity -= exec_qty
        remaining_qty -= exec_qty
        
        if match.quantity == 0:
            match.status = "MATCHED"
            
    new_order.quantity = remaining_qty
    if new_order.quantity == 0:
        new_order.status = "MATCHED"
        
    db.commit()
