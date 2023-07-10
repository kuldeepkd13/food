const express = require("express");
const {connection} = require("./config/db");
const { userRoute } = require("./routes/User.route");
const { resRoute } = require("./routes/restuarent.route");
const { orderRoute } = require("./routes/order.route");

const app = express()
app.use(express.json());
require("dotenv").config()

app.get("/",(req,res)=>{
    res.send("Food App")
})


app.use("/user",userRoute)
app.use("/resturent",resRoute)
app.use("/order",orderRoute)

app.listen(process.env.Port,async()=>{
    try {
        await connection
        console.log("Connected to MongoDb")
    } catch (error) {
        console.log(error.message)
        console.log("Not Connected to MongoDb")
    }
    console.log(`server is running at ${process.env.Port}`);
})