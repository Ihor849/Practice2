const jwt = require("jsonwebtoken");

module.exports = (rolesArr) => {
  return (req, res, next) => {
    // console.log(rolesArr);
    // next();

    try {
      //Рефакторім і прибераємо If,const [tokenType, token],const decoded
      // const [tokenType, token] = req.headers.authorization.split(" ");
      // if (tokenType === "Bearer" && token) {
        // console.log(tokenType);
        // console.log(token);
        // next(); Потрібен для перевірки в консолі на отримання tokenType та token
        // Розшифровуємо токєн
        // const decoded = jwt.verify(token, "pizza");
        // req.user = decoded;
        // console.log("decoded: ", decoded);
        // const roles = decoded.roles
        const roles = req.user.roles;
        let hasRole = false;
        roles.forEach(role => {
          if (rolesArr.includes(role)){
          hasRole = true;
          }
        });
        if (!hasRole) {
        res.status(403)
        throw new Error ("Forbidden")
        }
        next();
        // Приходить decoded
        // decoded:  {
        // friends: [ 'Dima', 'Ihor', 'Max' ],
        // id: '64dc82f07dfbcfbcb354ee28',    
        // roles: [ 'USER' ],
        // iat: 1692173990,
        // exp: 1692260390
        // }
      // }
    } catch (error) {
      res.status(403).json({
        code: 403,
        message: error.message,
      });
    }
    
  };
};
