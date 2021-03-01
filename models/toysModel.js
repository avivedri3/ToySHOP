const mongoose = require("mongoose");
const Joi = require("joi");


const toySchema = new mongoose.Schema({
  name:String,
  info:String, 
  category:String,
  img_url:String,
  price:String,
  user_id:String,
  date_created:{
    type:Date, default:Date.now
  }
})

exports.toyModel = mongoose.model("toys", toySchema);

exports.validToy = (_bodyData) =>{
  let joiSchema = Joi.object({
    name:Joi.string().min(2).max(20).required(),
    info:Joi.string().min(2).max(9999),
    category:Joi.string().min(2).max(9999).required(),
    img_url:Joi.string().min(1).max(9999),
    price:Joi.string().min(1).max(9999).required()
  })

  return joiSchema.validate(_bodyData);
}