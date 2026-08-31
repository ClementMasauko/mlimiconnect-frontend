# USSD operational controls

Provider traffic is restricted with `USSD_ALLOWED_IPS` and `USSD_RATE_LIMIT_PER_MINUTE`. Production deployments must list the provider callback ranges and must not use an unrestricted empty allowlist. Correlation IDs flow from the provider through backend requests. Logs record event names, latency and outcomes only; phone numbers, PINs and message text are excluded.

Redis is primary when configured. During a Redis outage the service uses process-local TTL storage, which keeps one instance available but does not share sessions across replicas. Alert on `redis.fallback`, use sticky routing during the incident, and restore Redis promptly. Provider requests retry once within the bounded timeout. Monitor `provider.retry`, `provider.delivery`, callback 429/403 rates and `/metrics`.

PIN recovery is support-led. Staff must verify the registered account owner through the approved identity procedure before disabling or resetting USSD access. Never request a mobile-money PIN.
