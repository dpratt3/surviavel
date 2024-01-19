# This script will ingest the berkley data and make it congruent to the SSA data

import pandas as pd

male_data = pd.read_csv("../storage/app/data/berkley-mortality-database/male-mortality-1941-2020.csv")
female_data = pd.read_csv("../storage/app/data/berkley-mortality-database/male-mortality-1941-2020.csv")

# Take year, age, age spec. mort., number of lives, and life expectancy
male_subset = male_data[['Year', 'Age', 'mx', 'lx', 'ex']]
female_subset = female_data[['Year', 'Age', 'mx', 'lx', 'ex']]

print(male_subset)

print(female_subset)



