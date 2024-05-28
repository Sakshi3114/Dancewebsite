const path =require("path");
const express = require("express");
const app = express();
const port = 80;
const hostname= '127.0.0.1';
// connecting mongodb with the website
const mongoose = require('mongoose');
// done by me for show details page
const db = mongoose.connection;


main().catch(err => console.log(err));

async function main() {
    
   await mongoose.connect('mongodb://127.0.0.1:27017/contactDance');

//   use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

// define the schema in mongoose
const ContactSchema = new mongoose.Schema({
    name: String,
    gender: String,
    phno: String,
    email: String,
    address: String,
    desc: String
    });

const Contact = mongoose.model('Contact', ContactSchema);  

//EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static'));// for serving static files 
app.use(express.urlencoded()); //this is used to store the urlencoded data into a file urlencoded because we are using html 

// PUG SPECIFIC STUFF
app.set("view engine","pug");// setting template for pug
app.set("views",path.join(__dirname,"views"));//setting views directory

// ENDPOINTS
app.get("/",(req,res)=>{
    res.status(200).render("home.pug");
 });
app.get("/contact",(req,res)=>{
    res.status(200).render("contact.pug");
 }); 
app.post("/contact",(req,res)=>{
    var myData = new Contact(req.body);
    myData.save().then(()=>{
        res.send("This item has been saved to the database.");
    }).catch(()=>{
        res.status(404).send("The item was not saved.");
    })
    // res.status(200).render("contact.pug");
 });


app.get("/showdetails", async(req,res) =>{
    try{
     const members = await Contact.find({});
     res.render("showdetails.pug",{x:members});
    }catch(error){
     res.status(404).send("The page not found");
    }
});

app.get("/member/:id", async(req,res)=>{
    try{
        const learner = await Contact.findById(req.params.id);
        res.render("learner.pug",{x:learner});
    }catch(error){
        res.status(404).send("the page cannot be found");
    }
})

app.get('/find',(req,res)=>{
    res.status(200).render("find.pug");
})
app.post("/findanyone", async(req,res)=>{
    try{
      const person = await Contact.find({name:req.body.name});
      res.render("particular.pug",{x:person});
    }catch(error){
        res.status(404).send("there is some error");
    }
})

//START SERVER
app.listen(port,()=>{
    console.log(`Server running at http://${hostname}:${port}/`);
    console.log(`The application succesfully started on ${port}`);
});
