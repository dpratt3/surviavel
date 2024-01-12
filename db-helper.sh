# Reset the database 
php artisan migrate:refresh

# Migrate the database
php artisan migrate

# Seed the database
php artisan db:seed

cd scripts
./interpolate.py

echo "Migration and seeding complete."


