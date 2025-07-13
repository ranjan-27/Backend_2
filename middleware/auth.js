/* in this we have to write the code of jwt tokens 
 Middleware checks the token:
Valid? → go to the route
Invalid/missing? → block access */

const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ msg: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // id, email, role
    next();
  } catch (e) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

module.exports = auth;

