const {Router} = require('express')

const route = Router()



route.get('/',(req,res)=>{
    res.send("halo world routes")
})







module.exports = {route}