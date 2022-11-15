const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {BadRequestError,UnauthenticatedError} = require('../errors')
const register = async(req,res)=>{
    /*
    const {name,email,password} = req.body

    const salt = await bcrypt.genSalt(10)
    // this salt means rand.bytes for 10 roundes of security

    const hashedPassword = await bcrypt.hash(password,salt)
    */

    // here all above stuff removed bcz, that be handleded by the userSchema.pre('save') func.

    const user = await User.create({
        ...req.body
    })
    const token = user.generateJWT()

    res.status(StatusCodes.CREATED).json({user:{ name: user.name}, token : token})
}


const login = async(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        throw new BadRequestError('Please Provide Email and Password.!!')
    }
    const user = await User.findOne({email})
    if(!user){
        throw new UnauthenticatedError('Invalid Credentials.!!')
    }
    const isCorrect = await user.comparePassword(password)

    if(!isCorrect){
        throw new UnauthenticatedError('Invalid Credentials.!!')
    }

    const token = user.generateJWT()
    res.status(StatusCodes.OK).json({user:{name:user.name},token:token})
}

module.exports = {
    register,
    login,
}