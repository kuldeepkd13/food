const jwt = require("jsonwebtoken")
const auth = async(req,res,next)=>{
    try {
        const token = res.headers.authorization;
        if(!token){
          return res.status(400).send({"msg":"provide token"})
        }
        const decoded = jwt.verify(token,'secret');
        if(!decoded){
            return res.status(400).send({"msg":"invalid token"})
        }
        res.body.UserId=decoded.UserId
        next()
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }
}

module.exports={auth}