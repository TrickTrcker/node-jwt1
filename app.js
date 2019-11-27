const express=require("express");
const port = process.env.port;
const userrouter = require("./routers/user.router");
require("./db/dbconfig");

const app=express();
app.use(express.json());
app.use(userrouter);
app.listen(port,()=>{
    console.log("app listening at port ",port);
})