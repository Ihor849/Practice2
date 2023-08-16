const { request } = require("https");
const DrinkModel = require("../models/drinksModel");

class DrinkService {

  add = async (req, res) =>{
    if(!req){
      return null;
      }
      const newDrink = await DrinkModel.create({...req});
      return newDrink;
  }


  all = async (req, res) => {
    const drinks = await DrinkModel.find({});
    if(!drinks){
    return null;
    }
    return drinks;
  };

 оne = async (req, res) => {
 
  const { id } = req;

    if(!id){
    return null;
    }
   const drink = await DrinkModel.findById(id);
    return drink;
  };

  update = async (req, res) =>{
    const { id, body} = req;
    const drink = await DrinkModel.findByIdAndUpdate(id, body,{new: true});
    
  
  return drink;
  }

  updateDrink = async (req, res) =>{
    
    const { id, body} = req;
    // console.log("id", id, "body", body);
    const drink  = await DrinkModel.findById(id);


    const newDrink = await DrinkModel.findByIdAndUpdate(id, updetedDrink,{new: true});
    // console.log(body);
  
  return newDrink;
  }
  
  remove = async (req, res) =>{
    const { id } = req;
    const drink = await DrinkModel.findByIdAndDelete(id);
    return drink;
  }

  
}

module.exports = new DrinkService();
