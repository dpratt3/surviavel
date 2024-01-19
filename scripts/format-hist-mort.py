# This script will ingest the berkley data and make it congruent to the SSA data

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

print(male_subset)

# Repeat for female
female_subset.rename(columns = {
        'Year': 'year',
        'Age': 'exact_age',
        'mx': 'female_death_probability',
        'lx': 'female_number_of_lives',
        'ex': 'female_life_expectancy'
        }, inplace = True)


female_subset['exact_age'] = female_subset['exact_age'].str.replace('+', '')

print(female_subset)


