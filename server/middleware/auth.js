// server/middleware/auth.js
const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const dotenv = require('dotenv');

dotenv.config();
// console.log("AUTH0 CONFIG:", {
//   domain: process.env.AUTH0_DOMAIN,
//   audience: process.env.AUTH0_AUDIENCE
// });

// Create middleware for checking the JWT against Auth0
const auth = jwt({
  // Fetch the signing key dynamically from Auth0 based on the Auth0 kid in the header
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256'],
  
  // Attach the user property to the request
  credentialsRequired: true,
  requestProperty: 'auth'
});

// Convert Auth0 user ID structure to match our app's expected format
const authWrapper = (req, res, next) => {
  // console.log("Auth middleware called");
  // console.log("Authorization header:", req.headers.authorization ? "Present" : "Missing");
  
  auth(req, res, (err) => {
    if (err) {
      console.error("Auth error type:", err.name);
      console.error("Auth error message:", err.message);
      console.error("Auth error code:", err.code);
      return res.status(401).json({ msg: 'Authorization failed', error: err.message });
    }

    // console.log("Auth0 token payload:", req.auth); 
    
    if (req.auth) {
      req.user = {
        id: req.auth.sub
      };
      // console.log("Authenticated user ID:", req.user.id);
    } else {
      return res.status(401).json({ msg: 'Authentication information missing' });
    }
    
    next();
  });
};

module.exports = authWrapper;