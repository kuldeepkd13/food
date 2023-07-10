const express = require("express");

const { UserModel } = require("../model/user.model");
const { ResturentModel } = require("../model/restuarent.model");
const { auth } = require("../middleware/auth.middleware");
const { OrderModel } = require("../model/order.model");

const orderRoute = express.Router();

// | POST | /api/orders | This endpoint should allow the user to place an order. | 201 |
orderRoute.post("/api/orders",auth,async(req,res)=>{
    try {
        const {restuarentid,items,totalPrice,deliveryAddress,status}= req.body

        const resturent = await ResturentModel.findById(restuarentid) 
        if(!resturent) {
            return res.status(400).send({"msg":"no resturent"})
        }
        payload = {
            user:req.body.UserID,
            restaurant:restuarentid,
            items,
            totalPrice,
            deliveryAddress
        }
        const order = new OrderModel(payload)
        await order.save()
        res.status(201).send({"msg":"order placed",order})
    } catch (error) {
        return res.status(400).send({msg:error.message})
    }
})
// | GET | /api/orders/:id | This endpoint should return the details of a specific order identified by its ID. (Populate all the details) | 200 |
orderRoute.get("/api/orders/:id",async(req,res)=>{
    const id = req.params.id
    try {
        const order = await OrderModel.findById(id)
        if(!order){
            return  res.status(400).send({"msg":"No such order With that id " })
        }
        res.status(200).send({"msg":"order details" , order})
    } catch (error) {
        res.status(400).send({ "msg": error.message })
    }
})
// | PUT / PATCH | /api/orders/:id | This endpoint should allow users to update the status of a specific order identified by its ID. | 204 |
orderRoute.patch("/api/orders/:id",async(req,res)=>{
    const id = req.params.id
    const status = req.body.status
    try {
        const order = await OrderModel.findById(id)
        if(!order){
            return  res.status(400).send({"msg":"No such order With that id " })
        }
        const updateorder = await OrderModel.findByIdAndUpdate({_id:id},{$set:{status}},{new:true})
        res.status(200).send({"msg":"order status updated" ,updateorder})
    } catch (error) {
        res.status(400).send({ "msg": error.message })
    }
})

module.exports = { orderRoute  }