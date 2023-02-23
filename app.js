const express = require( 'express' );
const app = express();
const morgan = require( 'morgan' );
const bodyParser = require( 'body-parser' )
const mongoose = require('mongoose')

const products = require( './api/routes/product.js' );
const order = require( './api/routes/order.js' );
const userRoutes = require( './api/routes/user.js' );


const products2 = require( './api/routes/product2.js' );
const order2 = require( './api/routes/order2.js' );

app.use( morgan( 'dev' ) );    //morgan are used for giving the data while sending request (status , time)
//use for reading json data
app.use(bodyParser.urlencoded({extended:false}))
app.use( bodyParser.json() )
app.use('/uploads',express.static('uploads'))

//cros eroor solution , * mean anyone or everyone
app.use( ( req, res, next ) => {
    res.header('Access-Control-Allow-Origin','*')
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type,Accept,Authorization"
    );
    if (req.method === 'OPRION') {
        res.header('Access-Control-Allow-Headers','PUT,POST,PATCH,DELETE,GET ')
        return res.status(200).json({})
    }
    next()
} )
mongoose.connect( 'mongodb://localhost:27017/rest-api-shop' ).then( () => {
    console.log('connected to mongoose')
} ).catch( ( err ) => {
   console.log(err) 
} )

app.use( '/products', products )
app.use( '/order', order )
app.use( '/user', userRoutes )

app.use( '/products2', products2 )
app.use( '/order2', order2 )

app.use( ( req, res, next ) => {
    const error = new Error('Not Found')
    error.status = 404;
    next(error)
} )

app.use( ( error ,req, res, next ) => {
    res.status( error.status || 500 );
    res.json( {
        error: {
            message:error.message
        }
    })
})

module.exports = app