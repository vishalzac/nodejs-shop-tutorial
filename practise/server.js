const express = require( 'express' )
const server = express()
const student = require('./routes/student.js')
const port = 3000


server.use('/',student)


server.listen( port, () => {
    console.log(`listening to port ${port} `)
})



