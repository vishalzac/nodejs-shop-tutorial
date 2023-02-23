const express = require( 'express' );
const { request } = require( '../../app.js' );
const router = express.Router();
const Order = require('../../model/order2.js');
const Product = require('../../model/product2.js')

router.get( '/', ( req, res, next ) => {
    Order.find( {} )
        .populate( 'product' )   //will give the info of product along with id 
        // .populate( 'product','name' )
        .then( docs => {
        const response = {
            order: docs.map( doc => {
                return {
                    _id: doc._id,
                    product: doc.product,
                    request: {
                        url:'http://localhost:3000/order/' + doc._id
                    }
                }
            })
        }
        res.status(200).json(response)
    }).catch( err => {
        res.status( 500 ).json( { error :err } )
    })
} )
router.post( '/', ( req, res, next ) => {
    Product.findById( req.body.productId ).then( product => {
        if ( !product ) {
            return res.status( 404 ).json( {
                message:"Product not found"
            })
        }
        const order = new Order( {
            product: req.body.productId,
            quantity: req.body.quantity
        } )
        return order.save()
    } )
        .then( result => {
            console.log( result )
            res.status( 201 ).json( {
                request: {
                url: "http:localhost:3000/order/" + result._id
            }
            } );
            
        } ).catch( err => {
            res.status( 500 ).json( {
                error:err
            })
        })
} )
router.get( '/:orderId', ( req, res, next ) => {
    Order.findById( req.params.orderId ).populate()
        .populate( 'product' )
        .then( order => {
            if ( !order ) {
                return res.status( 401 ).json( {
                message:"order not found"
            })
        }
        res.status( 200 ).json( {
            order: order,
            request: {
                url:'http://localhost:3000/order'
            }
        })
    } ).catch( err => {
        console.log( err )
        res.status(500).json({error :err})
    })
} )
router.delete( '/:orderId', ( req, res, next ) => {
    Order.remove( { _id: req.params.orderId } )
    .then( result => {
        res.status(200).send(result)
    } ).catch( err => {
        res.status( 500 ).send( { error:err } )
    })
} )

module.exports = router