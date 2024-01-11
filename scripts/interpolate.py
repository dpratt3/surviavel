import psycopg2
import pandas as pd
from scipy.interpolate import splrep, splev
import matplotlib.pyplot as plt

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

subset = df.loc[df['year'] == 2004, 'male_death_probability']

# Plot the subset
plt.plot(subset.index, subset, label='Male Death Probability (Year 2004)')

# Customize the plot
plt.title('Subset Plot')
plt.xlabel('Index')
plt.ylabel('Male Death Probability')
plt.legend()
plt.show()



