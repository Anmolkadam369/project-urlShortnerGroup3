const bodyParser = require("body-parser")
const express=require("express")
const route=require("./routes/route")
const app=express()
const mongoose=require("mongoose")

app.use(bodyParser.json())

mongoose.connect("mongodb+srv://Sakshi:monday123@cluster0.z5dpz2x.mongodb.net/group3Database")
.then(()=>{console.log("mongoDb is connected")})
.catch((err)=>{console.log(err.message)})

app.use('/',route)

app.listen( 3000, function () { 
    console.log('Express app running on port ' + (3000))
});




