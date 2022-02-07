const express = require('express'); 
const SibApiV3Sdk = require('sib-api-v3-sdk');
const app = express(); 
require("dotenv").config();
app.use(express.urlencoded({extended:true})); 
app.use(express.json());
app.use(express.static("public"));
// send email endpoint
app.post("/sendemail", (req, res, next) => {
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


// frontend endpoint 
app.use((req, res, next) => {
    res.sendFile(__dirname + "/index.html");
})

//To make listen to different port
app.listen(process.env.PORT||5000);