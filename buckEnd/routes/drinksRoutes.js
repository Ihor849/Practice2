// Cannot GET /api/v1/drinks
const drinksController = require('../controllers/DrinksController');

const drinksRouter = require('express').Router();

const rolesMiddleware = require("../middlewares/rolesMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

//додати напій 
drinksRouter.post('/drinks',(req, res, next) => {
    console.log('joi');
    next();

}, drinksController.add)

//отримати всі
// ["MODERATOR", "ADMIN", "USER", "CTO"]
drinksRouter.get('/drinks', authMiddleware, rolesMiddleware(["MODERATOR" , "ADMIN" ]), drinksController.getAll)

//отримати один 
drinksRouter.get('/drinks/:id', drinksController.getOne)

//оновити напій
drinksRouter.patch('/drinks/:id', drinksController.update)

// Оновити поле
drinksRouter.put('/drinks/:id', drinksController.updateDrink)

//видалити напій
drinksRouter.delete('/drinks/:id', drinksController.removeDrink)


module.exports = drinksRouter

