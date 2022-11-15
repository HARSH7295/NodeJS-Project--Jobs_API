const express = require('express')
const router = express.Router()

const {getAllJobs,getJob,createJob,updateJob,deleteJob} = require('../controllers/jobs')

router.route('/').post(createJob).get(getAllJobs)
router.route('/:id').get(getJob).delete(deleteJob).patch(updateJob)

// NOTE : NEW CONCEPT -> 
// here. router.route() is used to chaining the route handlers
// its work just same as the individual route
// ex. router.get('/',) , router.post('/',) --> combined/chained : router.route('/').get().post()

// it will get route and execute handler related to that route

module.exports = router