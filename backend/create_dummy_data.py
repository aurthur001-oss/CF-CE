
import pandas as pd
import random
from datetime import datetime, timedelta

# Create dummy data for EnergyMarket
data = {
    "Date": [(datetime.now() - timedelta(days=x)).strftime('%Y-%m-%d') for x in range(10)],
    "Region": ["North America", "Europe", "Asia-Pacific", "Europe", "North America", "Asia-Pacific", "Europe", "North America", "Asia-Pacific", "Europe"],
    "Fuel Type": ["Green Hydrogen", "Green Ammonia", "Blue Hydrogen", "CBG", "Bio-Methanol", "Green Hydrogen", "SAF", "Grey Hydrogen", "Green Ammonia", "Blue Ammonia"],
    "Price ($/kg)": [round(random.uniform(2.5, 8.0), 2) for _ in range(10)],
    "Volume (Tons)": [random.randint(100, 5000) for _ in range(10)],
    "Carbon Intensity (gCO2e/MJ)": [round(random.uniform(0, 20), 1) for _ in range(10)]
}

df = pd.DataFrame(data)

# Save to Excel
df.to_excel("em_data.xlsx", index=False)
print("em_data.xlsx created successfully.")
