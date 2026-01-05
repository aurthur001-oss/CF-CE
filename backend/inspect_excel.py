
import pandas as pd

try:
    xl = pd.ExcelFile("EM_1.xlsx")
    print("Sheet names:", xl.sheet_names)
    for sheet in xl.sheet_names:
        df = xl.parse(sheet)
        print(f"\n--- Sheet: {sheet} ---")
        print("Columns:", df.columns.tolist())
        print("First 2 rows:")
        print(df.head(2).to_string())
except Exception as e:
    print(f"Error reading Excel: {e}")
