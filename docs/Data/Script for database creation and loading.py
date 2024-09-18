import os
import pandas as pd
import sqlite3

# Get the current directory
current_dir = os.path.dirname(os.path.abspath(__file__))

# List of Excel files 
xls_files = [
    'Current account balance (% of GDP)',
    'Current account balance (USD Billions)',
    'GDP at current prices (USD Billions)',
    'GDP per capita current prices (USD)',
    'General government gross debt (% of GDP)',
    'General Government net lending and borrowing (% of GDP)',
    'Inflation rate, end of period consumer prices (Annual percent change)',
    'Population (millions of people)',
    'Real GDP Growth (%)',
    'Unemployment rate (%)',
    'Gov Expenditure (% of GDP)',
    'Gov Revenue (% of GDP)',
    'Gov Gross debt position (% of GDP)'
]

new_table_names = [
    'Current_account_balance_GDP',
    'Current_account_balance',
    'GDP_at_current_prices',
    'GDP_per_capita_current_prices',
    'General_government_gross_debt_GDP',
    'General_Government_net_lending_and_borrowing_GDP',
    'Inflation_rate',
    'Population',
    'Real_GDP_growth',
    'Unemployment_rate',
    'Gov_Expenditure_GDP',
    'Gov_Revenue_GDP',
    'Gov_Gross_debt_position_GDP'
]

# Connect to SQLite database
conn = sqlite3.connect(os.path.join(current_dir, 'weo.sqlite'))

# Iterate through Excel files and load them into SQLite tables
for xls_file, new_table_name in zip(xls_files, new_table_names):
    # Get the absolute path to the Excel file
    xls_path = os.path.join(current_dir, xls_file + '.xls')  

    # Load Excel data into a pandas DataFrame
    df = pd.read_excel(xls_path)

    # Write the DataFrame to a SQLite table with the new name
    df.to_sql(new_table_name, conn, if_exists='replace', index=False)

# Close the connection
conn.close()

# Print success message
print("Creation of World Economies database completed successfully.")
