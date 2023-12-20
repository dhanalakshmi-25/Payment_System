End-Points

Register User:

Endpoint: POST /register
Description: Register a new user.
Request Body: { "email": "user@example.com", "password": "password" }


Login User:

Endpoint: POST /login
Description: Authenticate a user.
Request Body: { "email": "user@example.com", "password": "password" }

Make Payment:

Endpoint: POST /make-payment
Description: Process a payment.
Request Body: { "cardNumber": "1234567890123456", "cvv": "123", "expDate": "12/24" }

Access Unpaid Content:

Endpoint: GET /unpaid-content
Description: Access denied message for unpaid users.

Access Content:

Endpoint: GET /content
Description: Access content after successful payment.
