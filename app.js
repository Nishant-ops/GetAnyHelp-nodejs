const express = require('express'); 
const path=require('path');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const multer=require('multer');
const blogModel=require("./Model/blogModel")
const app = express(); 
require("dotenv").config();
app.use(express.urlencoded({extended:true})); 
app.use(express.json());
app.use(express.static("public/build"));
app.use(express.static("uploads"));
const storage=multer.diskStorage({
    destination:function(req,file,cb)
    {
     cb(null,'./uploads/');
    },
    filename:function(req,file,cb)
    {
      cb(null,file.originalname);
    }
});

const upload=multer({storage:storage});
let read;
// send email endpoint
app.post("/newsletter", (req, res, next) => {
    const email = req.body.email; 
    let apikey = process.env.SIB_API_KEY 
    // auth + setup
    let defaultClient = SibApiV3Sdk.ApiClient.instance; 
    let apiKey = defaultClient.authentications['api-key']; 
    apiKey.apiKey = apikey; 

    // create contact 
    let apiInstance = new SibApiV3Sdk.ContactsApi(); 
    let createContact = new SibApiV3Sdk.CreateContact(); 
    createContact.email = email; 
    createContact.listIds = [2]; 
    createContact.attributes={
        'FIRSTNAME':req.body.name
    };

    // call SIB api 
    apiInstance.createContact(createContact).then((data) => {
        // success 
        res.status(200); 
        res.send("success");
    }, function (error) {
        // error
        console.log(error)
        res.status(500); 
        res.send("failure");
    })
})
app.get("/sendBlog/:id",async function(req,res)
{ 
  const obj=await blogModel.findById(req.params.id);
  res.json({
      body:obj,
  })
});
app.post("/send",function(req,res)
{
  console.log(req.body.content);
  read=req.body;
  
  res.json({
      message:read,
  })
});
app.get("/read",async function(req,res)
{
   const obj=await blogModel.find();
    res.json({
        body:obj,
    })
})
app.get("/sendBlog",async function(req,res)
{
  let obj=await blogModel.find();
  res.json({
      body:obj,
  })
});
app.post("/sendBlog",upload.single('image'),async function(req,res,next)
{
  console.log(req.body);
  console.log(req.file);
  const blog={
      authorName:req.body.author,
      title:req.body.title,
      image:req.file.originalname,
      paragraph:req.body.paragraph,
      category:req.body.category,
  } 
   const obj=await blogModel.create(blog);
  if(obj)
  {
      console.log(obj);
  }
  res.json({
      message:"recived",
  })
});


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../GetAnyHelp--nodejs/public/build', 'index.html'));
 });
//To make listen to different port
app.listen(process.env.PORT||5000);