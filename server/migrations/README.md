# Database Migrations

## Running migrations on production

```bash
# SSH into the server
ssh automation@69.62.108.82

# Navigate to project directory
cd /var/www/jokers

# Run the migration
docker exec -i postgresql-shared psql -U postgres -d jokers_prod < server/migrations/001_add_auth.sql

# Verify tables were created
docker exec -it postgresql-shared psql -U postgres -d jokers_prod -c "\dt"

# Check users table structure
docker exec -it postgresql-shared psql -U postgres -d jokers_prod -c "\d users"
```

## Migration 001: Add Authentication

This migration:
- Extends `users` table with email, role, fullName, phone, active, timestamps
- Creates unique index on email
- Updates existing admin user with email
- Creates Phase 2 tables: teams, players, match_inscriptions
- Seeds default teams (U7-U11, U13, U15, U17, U20, Adultes, École de patinage)
