const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        // const token = req.headers.Authorization.split(' ')[1]
        // const decodedToken = jwt.verify(token, 'bybypoplol')
        // const userId = decodedToken.id
        // if (userId) return 

        let token = req.headers["x-access-token"];
  
        if (!token) {
          return res.status(403).send({ message: "No token provided!" });
        }
      
        jwt.verify(token, 'bybypoplol', (err, decoded) => {
          if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
          }
          req.userId = decoded.id;
          next();
        });

    } catch (error) {
          console.log(error);
    }
}