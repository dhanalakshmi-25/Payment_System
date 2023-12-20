const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const port = 3000;
const secretKey = 'Module_1';

const content = {
  photo: 'https://www.gstatic.com/webp/gallery3/1.png',
  video: 'https://www.youtube.com/watch?v=EngW7tLk6R8&ab_channel=%E8%BF%9B%E5%87%BA%E5%8F%A3%E6%9C%8D%E5%8A%A1L'
};



//store user-credentials
const users = {};

//register end-point for user-registration
app.post('/register', (req, res) => {
  const { email, password } = req.body;

        if (users[email]) {
          return res.status(400).json({ message: 'User already exists' });
        }

  users[email] = { password, paymentStatus: 'pending' };
  res.status(201).json({ message: 'User registered successfully' });
  console.log(users);
});

//login end-point for registered user login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
      if (!users[email] || users[email].password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  res.json({ message: 'Authentication successful' });
});

//unpaid-content end-point for access denied 
app.get('/unpaid-content', (req, res) => {
    return res.status(403).json({ message: 'Please make a payment to access content.' });
});

//make-payment end-point to make payment
app.post('/make-payment', (req, res) => {
  const { cardNumber, cvv, expDate } = req.body;
        if (!cardNumber || !cvv || !expDate) {
          return res.status(400).json({ message: 'Invalid payment details' });
        }
        const paymentStatus = 'success';

  // Generate a token after successful payment
  const paymentToken = jwt.sign({ paymentStatus }, secretKey, { expiresIn: '1m' });
        res.json({ paymentToken });
});

//verify token after payment to access the content(photo and video)
const tokenMiddleware = (req, res, next) => {
  const token = req.headers['x-access-token'];
        if (!token) {
          return res.status(401).json({ message: 'Token is missing' });
        }

        try {
            const decoded = jwt.verify(token, secretKey);
            req.user = decoded;
            next();
        } catch (err) {
          return res.status(401).json({ message: 'Invalid token' });
        }
      };

//content end-point to access the content
app.get('/content', tokenMiddleware, (req, res) => {
      if (!req.user || req.user.paymentStatus !== 'success') {
        return res.status(403).json({ message: 'Payment not successful. Access denied.' });
      }
      res.json({ content });
});

//server running
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
