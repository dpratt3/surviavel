import psycopg2
import pandas as pd
from scipy.interpolate import UnivariateSpline
import matplotlib.pyplot as plt
import numpy as np

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

columnwise = pd.DataFrame()
for age in df['exact_age']:
    subset = df.loc[df['exact_age'] == age, ['year', 'male_death_probability']]
    subset = subset.set_index('year')
    columnwise[age] = subset
    print(subset)

print(columnwise)

def splineExpander(col):
    # fit spline to column
    spline = UnivariateSpline(col.index, col.values, k=3, s=0)
    return spline

splineList = [splineExpander(columnwise[col]) for col in columnwise.columns]

# Expand the timeline for a smoother curve
increment = 1/25
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

# Specify the column name you want to plot
age = 3  # Change this to the actual column name

# Plot the selected column
plt.plot(result_df.index, result_df[age], label=age)
plt.xlabel('Expanded Timeline')
plt.ylabel('Spline Values')
plt.title(f'Plot of {age}')
plt.legend()
plt.show()

