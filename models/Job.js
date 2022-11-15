const mongoose = require('mongoose')

const jobSchema = mongoose.Schema({
    company:{
        type : String,
        required : [true, 'Please Provide Company Name'],
        maxlength : 50
    },
    position:{
        type : String,
        required : [true, 'Please Provide Position'],
        maxlength : 100
    },
    status:{
        type : String,
        enum : ['interview','declined','pending'], // here enum used means status can have any one of the following values, not other thatn that
        // here required is by default false -> and we let that it be bcz status is modified when job is created and shown to user, not at time of job creation
        default : 'pending'
    },
    createdBy:{
        type : mongoose.Types.ObjectId, // binding Job with User
        required:[true,'Job cant be created without user'],
        ref: 'User', // here ref -> model to which we want to refer
    }
},{
    timestamps : true
})

const jobModel = mongoose.model('Job',jobSchema)

module.exports = jobModel

