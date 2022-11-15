const User = require('../models/User')
const jwt = require('jsonwebtoken')
const {UnauthenticatedError} = require('../errors')

const auth = async(req,res,next) =>{
    //checking header is correct or not
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith('Bearer')){
        throw new UnauthenticatedError('Authentication Invalid.!!')
    }
    const token = authHeader.split(' ')[1]

    try{
        const payload = jwt.verify(token,'jwtsecret')
        // here the key should be same as the one which provided at time of jwt token creation

        req.user = {userId : payload.userId, name : payload.name}
        next()
    }
    catch(error){
        throw new UnauthenticatedError('Authentication Invalid.!!')
    }

}

module.exports = auth