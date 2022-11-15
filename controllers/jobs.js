const Job = require('../models/Job')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')

const getAllJobs = async(req,res)=>{
    // NOTE : Keep in mind that we need to send back list of jobs created by current user
    // not the ones created by other users

    const jobs = await Job.find({
        createdBy : req.user.userId
    }).sort('createdAt')

    // it will check if job has createdBy same as user.id then ok

    res.status(StatusCodes.OK).json({jobs : jobs, count : jobs.length})
}
const getJob = async(req,res)=>{

    // finding job by id

    const {user : {userId},params:{id:jobId}} = req
    // it is nested destructuring
    // it is equvalent to
    /*
        const userId = req.user.userId
        const jobId = req.params.id
    */

    const job = await Job.findOne({
        _id : jobId,
        createdBy : userId
    })
    if(!job){
        throw new NotFoundError(`No job with id : ${jobId}`)
    }
    res.status(StatusCodes.OK).json({job})
}
const createJob = async(req,res)=>{
    req.body.createdBy = req.user.userId
    // here, in req.body we have added new field createdBy that have value req.user.userId(the id of current user)
    // by that the Job has ref. to user using userId
    // so its done
    // after that using req.body that contains company, position, createdby (all required fields)
    // we are good to go....
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
}
const updateJob = async(req,res)=>{
    // updates data in existing job

    // WORK FLOW : 
    // s-1 --> checking if update fields are the fields that our Job model have?
    //              if fields othrer than allowed is added then error
    // s-2 --> if fields are ok then finding by id and userid, if found then ok else error
    // s-3 --> if job found then update it and return

    // nested destructuring
    const {user : {userId},params:{id:jobId}} = req

    const allowedFields = ['company','position']
    const keys = Object.keys(req.body)

    const isValidFields = keys.every((key)=>{
        if(allowedFields.includes(key)){
            return true
        }
        else{
            return false
        }
    })
    // this loop will check for each and every key, that key is included by allowed options or not
    // if all are correctly added then return true
    // if even a single invalid field is there then returns false

    if(!isValidFields){
        throw new BadRequestError('Update invalid..Please enter valid fields.!!!')
    }
    else{
        const job = await Job.findOneAndUpdate({
            _id : jobId,
            createdBy : userId
        },
        req.body,
        {
            new : true,
            runValidators : true
        })

        if(!job){
            throw new NotFoundError(`No job with id : ${jobId}`)
        }
        res.status(StatusCodes.OK).json({job})
    }
}


const deleteJob = async(req,res)=>{

    // findjob and delete it
    const {
        user : {userId},
        params : {id : jobId}
    } = req

    const job = await Job.findOneAndDelete({
        _id : jobId,
        createdBy : userId
    })

    if(!job){
        throw new NotFoundError(`No job with id : ${jobId}`)
    }

    res.status(StatusCodes.OK).json({job})
}


module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
}