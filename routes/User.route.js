const express = require("express");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const { UserModel } = require("../model/user.model")

const userRoute = express.Router();

userRoute.post("/api/register", async (req, res) => {
    const { name, email, password, address } = req.body
    try {
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(400).send({ "msg": "User already there" })
        }
        const hash = bcrypt.hashSync(password, 10);
        const newuser = new UserModel({ name, email, password: hash, address })
        await newuser.save();
        res.status(201).send({ "msg": "Register Success", newuser })
    } catch (error) {
        res.status(400).send({ "msg": error.message })
    }
})

userRoute.post("/api/login", async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).send({ "msg": "NO User There register first" })
        }
        bcrypt.compare(password, user.password, function (err, result) {
            if (result) {
                const tokan = jwt.sign({UserId: `${user._id}`}, 'secret', { expiresIn: "7d" })
                res.status(201).send({ "msg": "Login Success", tokan })
            }else{
                res.status(400).send({ "msg": "Wrong Password"}) 
            }
        });

    } catch (error) {
        res.status(400).send({ "msg": error.message })
    }
})

userRoute.patch("/api/user/:id/reset",async(req,res)=>{
    const Userid = req.params.id
    const {currentpassword,newpassword} = req.body;
    try {
        const user = await UserModel.findOne({_id:Userid})
        if(!user){
            return res.status(400).send({ "msg": "NO User There register first" })  
        }
        bcrypt.compare(currentpassword, user.password, async function (err, result) {
            if (result) {
                const hash = bcrypt.hashSync(newpassword, 10);
                user.password = hash
                await user.save()
                res.status(204).send({ "msg": "Password Reset", user })
            }else{
                res.status(400).send({ "msg": "Please provide Correct Current Password"}) 
            }
        });
    } catch (error) {
        res.status(400).send({ "msg": error.message })
    }
})

module.exports = { userRoute }