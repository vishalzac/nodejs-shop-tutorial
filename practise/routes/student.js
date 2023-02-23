const express = require( 'express' )
const router = express.Router()
const stuData = require( '../controller/student.js' )
const stuMiddleware = require('../middleware/student.js')
const port = 3000


router.get( '/', stuMiddleware, stuData)


module.exports = router;





