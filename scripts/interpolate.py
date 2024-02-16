#!/usr/bin/env python3

import psycopg2
import pandas as pd
from scipy.interpolate import UnivariateSpline
import matplotlib.pyplot as plt
import numpy as np
from sqlalchemy import create_engine
import re
import warnings

# Database information
dbname = "life_tables"
user = "postgres"
password = "password"
host = "localhost"
port = "5432"

# Define query
query = "SELECT * FROM life_tables"

try:
    connection = psycopg2.connect(
        dbname=dbname,
        user=user,
        password=password,
        host=host,
        port=port
    )

    cursor = connection.cursor()
    
    cursor.execute(query)

    rows = cursor.fetchall()

    cols = [name[0] for name in cursor.description]
    df = pd.DataFrame(rows, columns = cols)

    print(df)
    
except psycopg2.Error as e:
    print("Unable to connect to the database.")
    print(e)

finally:
    # Close the cursor and connection when done
    if cursor:
        cursor.close()
    if connection:
        connection.close()

# Pandas is only compatible with SQLALchemy
engine = create_engine(f'postgresql://{user}:{password}@{host}:{port}/{dbname}')
        
# From the original database
colnames = [ 'male_death_probability',  
             'male_number_of_lives',
             'male_life_expectancy',
             'female_death_probability', 
             'female_number_of_lives',
             'female_life_expectancy']

for colname in colnames:
    warnings.filterwarnings("ignore", category=pd.errors.PerformanceWarning)
    columnwise = pd.DataFrame()
    for age in df['exact_age']:
        subset = df.loc[df['exact_age'] == age, ['year', colname]]
        subset = subset.set_index('year')
        columnwise[age] = subset
        # print(subset)
    warnings.resetwarnings()

    # columnwise = columnwise.sort_index()
    print(columnwise)

    def splineExpander(col):
        # fit spline to column
        col = col.sort_index()
        spline = UnivariateSpline(col.index, col.values, k=3, s=0)
        return spline

    splineList = [splineExpander(columnwise[col]) for col in columnwise.columns]

    # Expand the timeline for a smoother curve
    increment = 1/12
    minYear = min(columnwise.index)
    maxYear = max(columnwise.index)
    expandedTimeline = np.arange(minYear, maxYear + increment, increment)

    # Feed each spline the expanded time line
    splineValues = [spline(expandedTimeline) for spline in splineList]
    result_df = pd.DataFrame(np.column_stack(splineValues), index=expandedTimeline)

    # Get the dimensions (number of rows and columns) of the DataFrame
    num_rows, num_columns = result_df.shape

    # Print the dimensions
    print(f'Number of rows: {num_rows}')
    print(f'Number of columns: {num_columns}')

    # Specify the column name
    # age = 3  # Change this to the actual column name1
    # plt.legend()
    # plt.show()

    # write table names to database
    table_name = colname + '_interpolated'
    
    if("lives" in table_name):
        result_df = np.round(result_df)

    result_df['year'] = np.round(result_df.index, 2)
    result_df.to_sql(name=table_name, con=engine, index=False, if_exists='replace')




    

