const DrinkModel = require("../models/drinksModel");
const asyncHandler = require("express-async-handler");
const DrinkService = require("..//service/DrinkService")


class DrinksContoller {
  add = asyncHandler(async (req, res) => {
    const { name, value } = req.body;
    if (!name || !value) {
      res.status(400);
      throw new Error("Provide all required fields");
    }
    // const newDrink = await DrinkModel.create({ ...req.body });
    const newDrink = await DrinkService.add({...req.body});
    res.status(200).json({
      code: 200,
      newDrink,
    });
  });

  // getAll = asyncHandler(async (req, res) => {
  //   const drinks = await DrinkModel.find({});
  //   res.status(200).json({
  //     code: 200,
  //     data: {
  //       drinks,
  //       qty: drinks.length, //quantity-qty кол-во
  //     },

  //   });
  // });

  getAll = asyncHandler(async (req, res) => {
    // const drinks = await DrinkModel.find({}); //запыт в БД  вынесен в DrinkService
    const drinks = await DrinkService.all();
    if(!drinks) {
      res.status(400);
      throw new Error("Provide all required fields");
    };
    res.status(200).json({
      code: 200,
      data: {
        drinks,
        qty: drinks.length, //quantity-qty кол-во
      },

    });
  });

  getOne = asyncHandler(async (req, res) => {
  
    const { id } = req.params;
    console.log(id);
    const drink = await DrinkService.оne({id});

    if (!drink) {
      res.status(400);
      throw new Error("Drink not found");
    }
    res.status(201).json({
      code: 201,
      drink
    });
    
  });

  update = asyncHandler(async (req, res) => {
    // console.log(req.params);
    // console.log(req.body);
    const { id } = req.params;
    const drink = await DrinkService.update({id, body: {...req.body}});
    res.status(201).json({
      code: 201,
      message: "drink updated successfully",
      drink
    });
  });

  updateDrink = asyncHandler(async (req, res) => {
    // console.log(req.params);
    // console.log(req.body);
    console.log("r.body", req.body);

    const { id } = req.params;
    const drink = await DrinkService.updateDrink({id, body: {...req.body}});
    res.status(201).json({
      code: 201,
      message: "drink updated successfully",
      drink
    });
  });
  

  removeDrink = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const drink = await DrinkService.remove({id});
    res.status(200).json({
      code: 200,
      message: "drink deleted successfully",
      drink
    });
  });
}

module.exports = new DrinksContoller();
