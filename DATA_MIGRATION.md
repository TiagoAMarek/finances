
# Data Migration

For complex schema changes that require data transformation:

## Categories

### 1. Check Migration Status

```bash
curl -X GET http://localhost:3000/api/admin/migrate-categories
```

### 2. Run Data Migration

```bash
curl -X POST http://localhost:3000/api/admin/migrate-categories
```
