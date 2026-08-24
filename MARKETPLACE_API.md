# Marketplace listing contract

The marketplace accepts verified sellers regardless of whether they are individual farmers, cooperatives, companies, NGOs, institutions, government programs, equipment dealers, manufacturers, or approved partners. The account must have `can_sell=true`; verified organizations may publish listings through authorized staff.

## Categories

Use stable values: `produce`, `seeds`, `farm-inputs`, `tools`, `equipment`, and `machinery`. Equipment listings must include condition and may use fixed-price or auction selling. The backend should support optional category-specific attributes such as make, model, year, power source, warranty, service history, delivery/pickup, and spare-parts availability.

## Paginated discovery

`GET /api/marketplace/public-listings/?page_size=24&category=equipment&ordering=-created_at`

Return a standard paginated shape:

```json
{
  "count": 240,
  "next": "/api/marketplace/public-listings/?page=2&page_size=24",
  "previous": null,
  "results": []
}
```

Enforce a maximum page size, use indexed filtering and ordering, and return optimized thumbnail URLs. Search, category, condition, price, location, seller verification, and listing format should be server-side filters. Do not make the browser download the entire catalog.

## Partner inventory

Partners should use the same listing model through scoped API credentials or staff accounts. Record `seller_id`, `organization_id`, stock ownership, fulfillment responsibility, warranty provider, commission agreement, and source system. Idempotency keys are required for inventory imports so retries do not duplicate listings.
