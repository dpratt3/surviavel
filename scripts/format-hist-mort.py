#!/usr/bin/env python3

# This script will ingest the berkley data and make it congruent to the SSA data
import psycopg2
from sqlalchemy import create_engine
import pandas as pd

import pandas as pd

male_data = pd.read_csv("../storage/app/data/berkley-mortality-database/male-mortality-1941-2020.csv")
female_data = pd.read_csv("../storage/app/data/berkley-mortality-database/male-mortality-1941-2020.csv")

# Take year, age, age spec. mort., number of lives, and life expectancy
male_subset = male_data[['Year', 'Age', 'mx', 'lx', 'ex']]
female_subset = female_data[['Year', 'Age', 'mx', 'lx', 'ex']]

# rename columns: exact_age | male_death_probability | male_number_of_lives | male_life_expectancy
male_subset.rename(columns = {
        'Year': 'year',
        'Age': 'exact_age',
        'mx': 'male_death_probability',
        'lx': 'male_number_of_lives',
        'ex': 'male_life_expectancy'
        }, inplace = True)


male_subset['exact_age'] = male_subset['exact_age'].str.replace('+', '')

# Repeat for female
female_subset.rename(columns = {
        'Year': 'year',
        'Age': 'exact_age',
        'mx': 'female_death_probability',
        'lx': 'female_number_of_lives',
        'ex': 'female_life_expectancy'
        }, inplace = True)


female_subset['exact_age'] = female_subset['exact_age'].str.replace('+', '')

# Drop all years subsequent to 2003 (since we already have data)
male_subset = male_subset[male_subset['year'] <= 2003]
female_susbset = female_subset[female_subset['year'] <= 2003]

print(male_subset)
print(female_subset)

life_table_extended = pd.merge(male_subset, female_subset, on=['year', 'exact_age'],  how="inner")

# order columns as they already are in the life table:
column_order = [
    'exact_age',
    'male_death_probability',
    'male_number_of_lives',
    'male_life_expectancy',
    'female_death_probability',
    'female_number_of_lives',
    'female_life_expectancy',
    'year'
]

life_table_extended = life_table_extended[column_order]
print(life_table_extended)

# Database connection information
dbname = "life_tables"
user = "postgres"
password = "password"
host = "localhost"
port = "5432"

# Create a SQLAlchemy engine
engine = create_engine(f'postgresql://{user}:{password}@{host}:{port}/{dbname}')

# Fetch existing data from the PostgreSQL table
existing_data = pd.read_sql('SELECT * FROM life_tables', engine)

# Prepend life_table_extended to existing_data
combined_data = pd.concat([life_table_extended, existing_data], ignore_index=True)

# Write the combined and modified data to the PostgreSQL table
combined_data.to_sql('life_tables', engine, if_exists='replace', index=False)

# Close the database connection
engine.dispose()
