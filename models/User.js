const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name:{
        type : String,
        required : [true, 'Please Provide Name'],
        // here, needed true, and if false found then send error msg saying above line
        minlength : 3,
        maxlength : 50,
    },
    email:{
        type : String,
        required : [true, 'Please Provide Email'],
        match : [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please Provide Valid Email'],
        unique : true
    },
    password:{
        type : String,
        required : [true,'Please Provide Password'],
    },
})


// class/schema based method
userSchema.pre('save',async function(next){

    // here added password hashing func. and removed from the auth controller
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
    next()
})

// shcema's INSTANCE METHOD --> TOKEN GENERATOR
userSchema.methods.generateJWT = function(){
    return jwt.sign({
        userId : this._id,
        name : this.name
    },'jwtsecret',{
        expiresIn : '30d'
    })
}


// INSTANCE METHOD --> PASSWORD COMPARING
userSchema.methods.comparePassword = async function(candidatePassword){
    const isMatched = await bcrypt.compare(candidatePassword,this.password)
    return isMatched
}


const userModel = mongoose.model('User',userSchema)
// creating model in mongoose using schema defined

module.exports = userModel