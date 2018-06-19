var express = require('express');
var router = express.Router();
var async = require('async');
const mongodb=require('mongodb').MongoClient;
var db_str="mongodb://localhost:27017/student"
var Objectid = require("mongodb").ObjectId;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/rijiadd",function (req,res) {
  res.render('rijiadd',{})
})


router.get('/main',(req,res)=>{
//	页码
	var pageNo=req.query.pageNo;
	pageNo=pageNo?pageNo:1;
//	每页展示的数量
	var size=3;
//	总的留言数
	var count=0;
//	总的页码数
	var page=0;

	mongodb.connect(db_str,(err,database)=>{
		database.collection('data',(err,coll)=>{
			async.series([
				function(callback){
					coll.find({}).toArray((err,data)=>{
						count=data.length;
						page=Math.ceil(count/size)

//						上一页／下一页
						pageNo=pageNo<0?1:pageNo;
						pageNo=pageNo>page?page:pageNo;

						callback(null,'')
					})
				},
				function(callback){
					coll.find({}).sort({_id:-1}).limit(size).skip((pageNo-1)*size)
					.toArray((err,data)=>{
						callback(null,data)
					})
				}
			],function(err,data){
				res.render('main',{data:data[1],size:size,count:count,page:page,pageNo:pageNo})
				database.close()
			})
		})
	})
})


// 删除
router.get('/shan',(req,res)=>{
  var id=Objectid(req.query.id)
  console.log(id);
  mongodb.connect(db_str,(err,database)=>{
    database.collection("data",(err,coll)=>{
       coll.remove({"_id":id},(err,data)=>{
              res.send("1");
              database.close()
       })
      })
    })
  })


  router.post('/chazhao',(req,res)=>{
    var nam=req.body.name;
    var cc=[];
    console.log(nam);
    mongodb.connect(db_str,(err,database)=>{
      database.collection("data",(err,coll)=>{
        coll.find({}).toArray((err,data)=>{

          data.map(function(item){
            if(item.tit.match(nam)){
              cc.push(item);
            }
          })
          res.send(cc);
        })
      })
    })
  })
module.exports = router;
