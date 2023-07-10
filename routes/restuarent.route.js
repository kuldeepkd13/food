const express = require("express");

const { UserModel } = require("../model/user.model");
const { ResturentModel } = require("../model/restuarent.model");
const { default: mongoose } = require("mongoose");

const resRoute = express.Router();

resRoute.post("/add",async(req,res)=>{
    const {name,address,menu} = req.body
 try {
    const restuarent = new ResturentModel({name,address,menu})
    await restuarent.save()
    res.status(200).send({"msg":"resturent added" ,restuarent})
 } catch (error) {
    res.status(400).send({ "msg": error.message })
 }
})

// GET
// /api/restaurants
// This endpoint should return a list of all available restaurants.
// 200

resRoute.get("/api/restaurants",async(req,res)=>{
    try {
        const allresturent = await ResturentModel.find()
        res.status(200).send({"msg":"List of all resturent" , allresturent})
    } catch (error) {
        res.status(400).send({ "msg": error.message })
    }
})
// GET
// /api/restaurants/:id
// This endpoint should return the details of a specific restaurant identified by its ID.
// 200
resRoute.get("/api/restaurants/:id",async(req,res)=>{
    const id = req.params.id
    try {
        const resturent = await ResturentModel.findById(id)
        if(!resturent){
            return  res.status(400).send({"msg":"No such resturent With that id " })
        }
        res.status(200).send({"msg":"Resturent details" , resturent})
    } catch (error) {
        res.status(400).send({ "msg": error.message })
    }
})
// GET
// /api/restaurants/:id/menu
// This endpoint should return the menu of a specific restaurant identified by its ID.
// 200
resRoute.get("/api/restaurants/:id/menu",async(req,res)=>{
    const id = req.params.id
    try {
        const resturent = await ResturentModel.findById(id)
        if(!resturent){
            return  res.status(400).send({"msg":"No such resturent With that id " })
        }
        const menu = resturent.menu
        res.status(200).send({"msg":"Resturent menu" ,menu })
    } catch (error) {
        res.status(400).send({ "msg": error.message })
    }
})
// POST / PUT
// /api/restaurants/:id/menu
// This endpoint should allow the user to add a new item to a specific restaurants menu identified by it id.
// 201
resRoute.post("/api/restaurants/:id/menu",async(req,res)=>{
    const id = req.params.id
    const {menu} = req.body
    try {
        const resturent = await ResturentModel.findById(id)
        if(!resturent){
            return  res.status(400).send({"msg":"No such resturent With that id " })
        }
        
        resturent.menu.push(menu);
        await resturent.save();
        return  res.status(200).send({"msg":"Menu Added",resturent})
    } catch (error) {
        res.status(400).send({ "msg": error.message })
    }
})

// DELETE
// /api/restaurants/:id/menu/:id
// This endpoint should allow the user to delete a particular menu item identified by its id from a specific restaurant.
resRoute.delete("/api/restaurants/:resid/menu/:menuid",async(req,res)=>{
    const {resid,menuid} = req.params
    
    try {
        const resturent = await ResturentModel.findById(resid)
        if(!resturent){
            return  res.status(400).send({"msg":"No such resturent With that id " })
        }
       
        return  res.status(400).send({"msg":"Menu delete"})
    } catch (error) {
        res.status(400).send({ "msg": error.message })
    }
})
module.exports = { resRoute }