const { json } = require("express");
const express = require("express");
const { reverse } = require("lodash");
const _ = require("lodash");
const {authToken} = require ("../middlewares/auth");
const { toyModel, validToy } = require ("../models/toysModel");
const router = express.Router();

router.get("/", async(req, res) => {
  let perPage = (req.query.perPage)? Number(req.query.perPage) : 10;
  let page = req.query.page;
  let catName = req.params.catName;
  let ifReverse = (req.query.reverse == "yes") ? -1 : 1 ;
  let reg = new RegExp(catName,"i")
  try {
    let data = await toyModel.find({})
    .sort({[reg]:ifReverse})
    .limit(perPage)
    .skip(page * perPage)
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});


router.get("/cat/:catName", async(req, res) => {
  let perPage = (req.query.perPage)? Number(req.query.perPage) : 10;
  let page = req.query.page;
  let catName = req.params.catName;
  let ifReverse = (req.query.reverse == "yes") ? -1 : 1 ;
  let reg = new RegExp(catName,"i")
  try {
    let data = await toyModel.find({category:reg})
    .sort({[reg]:ifReverse})
    .limit(perPage)
    .skip(page * perPage)
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.get("/price", async(req,res)=>{
  let perPage = (req.query.perPage)? Number(req.query.perPage) : 10;
  let page = req.query.page;
  let catName = req.params.catName;
  let ifReverse = (req.query.reverse == "yes") ? -1 : 1 ;
  let reg = new RegExp(catName,"i")
  try{
    let min= Number(req.query.min);
    let max= Number(req.query.max);
    let prodData = await toyModel.find({})
    .sort({
      [reg]:ifReverse
    })
    .limit(perPage)
    .skip(page * perPage)
    let Filter = await prodData.filter(item =>{
      return item.price >= min &&item.price<= max;
    })
    res.json(Filter);
  }
  catch(err){
    console.log(err);
    res.status(400).json(err);

  }
})

router.post("/" ,authToken, async(req,res) => {
  let validBody = validToy(req.body)
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let toy = new toyModel(req.body);
    toy.user_id = req.userData._id;
    await toy.save();
    res.status(201).json(toy);
  }
  catch(err){
    console.log(err);
    res.status(400).json(err)
  }
})

router.get("/search",async(req,res) => {
  let qString = req.query.s;
   let perPage = (req.query.perPage)? Number(req.query.perPage) : 10;
  let page = req.query.page;
  let qReg = new RegExp(qString,"i")
  let data = await toyModel.find({$or:[{name:qReg},{info:qReg}]})
  .limit(perPage)
  .skip(page * perPage)
  res.json(data);
})

router.put("/edit/:idEdit", authToken, async(req,res) => {
  let idEdit = req.params.idEdit;
  let validBody = validToy(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try{
    let updateData = await toyModel.updateOne({_id:idEdit, user_id:req.userData.id},req.body);
    res.json(updateData);
  }
  catch(err){
    console.log(err);
    res.status(400).json(err);
  }
})

router.delete("/:del", authToken , async(req,res) => {
  let del = req.params.del;
  try{
    let toy = await toyModel.deleteOne({_id:del,user_id:req.userData._id});
    res.json(toy);
  } 
  catch (err) {
    console.log(err);
    res.status(400).json(err);
  } 
})


module.exports = router;