const express = require( 'express' );
const port = process.env.PORT || 3000;
const app = require('./app.js')
const server = express()

server.use('/',app)


server.listen( port, () => {
    console.log(`Listening to port ${port}`)
})

