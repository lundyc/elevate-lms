const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const { auth0Domain, auth0Audience } = require('../config');

const client = jwksClient({
  jwksUri: `https://${auth0Domain}/.well-known/jwks.json`
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

function checkJwt(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });

  jwt.verify(
    token,
    getKey,
    {
      audience: auth0Audience,
      issuer: `https://${auth0Domain}/`,
      algorithms: ['RS256']
    },
    (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }
      req.user = decoded;
      next();
    }
  );
}

module.exports = { checkJwt };
