const express = require('express');
const bcrypt = require("bcrypt");
const _ = require("lodash");
const {UserModel ,validUser , validLogin, genToken} = require("../models/userModel");
const { authToken } = require('../middlewares/auth');
const router = express.Router();

router.get('/', async(req, res) => {
  try{
  let data = await UserModel.find({},{pass:0})
  res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.get("/myInfo",authToken ,async(req,res) => {
  try{
    // req.userData -> נוצר בקובץ מידלווארי אוט
    let user = await UserModel.findOne({_id:req.userData._id},{pass:0});
    res.json(user);
  }
  catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
})


router.post("/login",async(req,res) => {
  let validBody = validLogin(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try{
    // קודם בודק שבכלל קיים יוזר עם האימייל הנל
    let user = await UserModel.findOne({email:req.body.email});
    if(!user){
      return res.status(400).json({msg:"user or password invalid 1"});
    }
    let validPass = await bcrypt.compare(req.body.pass,user.pass);
    if(!validPass){
      return res.status(400).json({msg:"user or password invalid 2"});  
    }
    let myToken = genToken(user._id);
    res.json({token:myToken});
  }
  catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
})


router.post("/", async(req,res) => {
  let validBody = validUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try{
    let user = new UserModel(req.body);
    let salt = await bcrypt.genSalt(10);
    user.pass = await bcrypt.hash(user.pass, salt);
    await user.save();
    res.status(201).json(_.pick(user,["_id","email","date_created","name", "role"]))
  }
  catch (err) {
    console.log(err);
    res.status(400).json(err);
  }

})

module.exports = router;
