const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // console.log("auth"); //authMiddleware затягуємо в сервер и перевіряємо чи пріхоліт auth
  // Отримуємо токен
  try {
    const [tokenType, token] = req.headers.authorization.split(" ");
    if (tokenType === "Bearer" && token) {
      // console.log(tokenType);
      // console.log(token);
      // next(); Потрібен для перевірки в консолі на отримання tokenType та token
      // Розшифровуємо токєн
      const decoded = jwt.verify(token, "pizza");
      req.user = decoded;
      next();
      // console.log("decoded: ", decoded);
      
      // Приходить decoded
      // decoded:  {
      //     friends: [ 'Dima', 'Ihor', 'Max' ],
      //     id: '64dbf1c440623afa99463922',
      //     iat: 1692137977,
      //     exp: 1692224377
      //   },
      // "roles": [
      //   "USER"
      // ],
    }
  } catch (error) {
    res.status(401).json({
      code: 401,
      message: error.message,
    });
  }
};
// Передаємо інформацию з токена далі