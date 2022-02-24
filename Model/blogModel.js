const mongoose=require('mongoose');
const express=require('express');
const app=express();
const dompurify=require('dompurify');
const {JSDOM} = require('jsdom');
const htmlpurify=dompurify(new JSDOM().window);

const db_link="mongodb+srv://admin:w8okoyHLCDTI4PNH@cluster0.mmuhd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(db_link).then(function(db)
{
    console.log(db);
console.log("connected to db");
}).catch(function(err)
{
    console.log(err);
});

const blogSchema=mongoose.Schema({
    authorName:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true,
        unique:true,
    },
    image:{
        type:String,
    },
    paragraph:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    }
});


const blogModel=mongoose.model('blogModel',blogSchema);

module.exports=blogModel;