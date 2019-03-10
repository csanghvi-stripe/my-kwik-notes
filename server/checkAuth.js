const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const checkAuth = function(req, res, next) {
  var token =
    req.body.token ||
    req.query.token ||
    req.headers['x-access-token'] ||
    req.headers['authorization'];
    if (!token) {
    res.status(401).send('Unauthorized: No token provided');
  } else {
    token = token.replace('Bearer ', '');
    jwt.verify(token, process.env.JWT_SECRET, function(err, user) {
      if (err) {
        return res.status(401).json({
          success: false,
          message: 'Please use google Auth to create manage notes'
        });
      } else {
        req.user = user; //set the user to req so other routes can use it
        console.log("Parsed user object from token i %o", user);
        next();
      }
    });
  }
}
module.exports = checkAuth;
