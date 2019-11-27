const express = require("express");
const User = require("../models/user.model");
const router = express.Router();

router.post("/users",async (req,res)=>{
    try {
        const user=new User(req.body);
        await user.save();
        const token = await user.generateAuthToken();
        res.status(200).send({user,token});
    } catch (error) {
        res.status(400).send({
            error : error
        });
    }
});
router.post("/users/login",async (req,res)=>{
    try {
        debugger;
        const { email,password}=req.body;
        const user = await User.findByCrendentials(email,password);
        if(!user){
            return res.status(401).send({
                error : "login failed."
            });
        }
        const token = await user.generateAuthToken()
        res.status(200).send(user,token);
    } catch (error) {
        return res.status(500).send({
            error : "server error."
        });
    }
});
module.exports=router;