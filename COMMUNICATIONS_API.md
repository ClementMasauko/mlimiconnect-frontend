# Messaging and notifications API

The frontend now uses these authenticated, CSRF-protected endpoints:

- `GET /api/messages/conversations/`
- `POST /api/messages/conversations/`
- `GET /api/messages/conversations/{id}/messages/`
- `POST /api/messages/conversations/{id}/messages/`
- `POST /api/messages/conversations/{id}/read/`
- `GET /api/notifications/`
- `POST /api/notifications/{id}/read/`
- `POST /api/notifications/read-all/`
- `GET|PUT /api/users/notifications`
- `POST /api/push/subscriptions/`
- `DELETE /api/push/subscriptions/{id}/`

Conversation, message and notification lists may use the standard `{ count, next, previous, results }` pagination shape. A participant may access only their conversations. Validate message length, escape rendered content, rate-limit sending, block executable attachments, retain an audit trail, and provide report/block controls.

The UI polls conversations every 15 seconds, an open chat every 8 seconds and notifications every 30 seconds. A WebSocket service can replace polling later, but it must use the same session authorization and persist every message before broadcast.

Notification preferences are optional-channel choices. Security, authentication, payment, dispute, account-status and legally required messages remain mandatory. Push subscriptions must be bound to the authenticated user and removable per device.
