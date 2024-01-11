import psycopg2
import pandas as pd

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

except psycopg2.Error as e:
    print("Unable to connect to the database.")
    print(e)

finally:
    # Close the cursor and connection when done
    if cursor:
        cursor.close()
    if connection:
        connection.close()


[print(row) for row in rows]


