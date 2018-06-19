var express = require('express');
var router = express.Router();
const mongodb=require('mongodb').MongoClient;
var db_str="mongodb://localhost:27017/student"
var Objectid = require("mongodb").ObjectId;
// var upload = require("./upload");
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/main',function(req,res){
  mongodb.connect(db_str,(err,database)=>{
    database.collection("class",(err,coll)=>{
      coll.find(req.body).toArray((err,data)=>{
          if(data.length>0){
            // req.session.name=data[0].name;
            res.send("1");
          }else{
            res.send("2");
          }
          database.close();
      })
    })
  })
})

// 添加
  router.post("/add",function(req,res){
    mongodb.connect(db_str,(err,database)=>{
      database.collection("data",(err,coll)=>{
        coll.insertOne(req.body,()=>{
          res.send("1");
          database.close();
        })
      })
    })
  })



  // 修改留言
  router.post('/xiugai',(req,res)=>{
    var id=Objectid(req.body.id)
    console.log(req.body)
    mongodb.connect(db_str,(err,database)=>{
      database.collection("data",(err,coll)=>{
          coll.update({"_id":id},{$set:{"tit":req.body.tit,"con":req.body.con}},(err,data)=>{
            res.send("1");
            database.close()
          })
      })
    })
  })

module.exports = router;
