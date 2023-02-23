const express = require( 'express' );
const product = require( '../../model/product.js' );
const router = express.Router();
const Product = require( '../../model/product.js' )
const checkAuth = require('../routes/middleware_auth.js')

router.get( '/', ( req, res, next ) => {
    product.find({}).select( 'name price _id' ).then( docs => {
        const response = {
            products: docs.map( doc => {
                return {
                    _id:doc._id,
                    request: {
                        url:'http://localhost:3000/products/' + doc._id
                    }
                }
            })
        }
        res.status(200).json(response)
    } ).catch( err => {
        res.status(400).send(err)
    })
} )
router.post( '/',checkAuth,( req, res, next ) => {
    const product = new Product( {
        name: req.body.name,
        price: req.body.price
    } )
    product.save().then( result => {
        console.log(result)
    }).catch(err => console.log(err))
    res.status( 201 ).json( {
        message: 'Handling POST request to /product',
        createProduct: product
    } )
} );
router.get( '/:productId', ( req, res, next ) => {
    const id = req.params.productId;
    console.log(id)
    Product.find( { _id: id } ).then( doc => {
        console.log( doc )
        res.status(200).json(doc)
    } ).catch( err => {
        console.log( err )
        res.status(500).json({error :err})
    })
} )
router.patch( '/:productId', ( req, res, next ) => {
    const id = req.params.productId;
    Product.updateOne({_id:id},req.body, {
            new: true
    } ).then( result => {
        res.status(200).send(result)
    }).catch( err => {
            res.status(400).send(err)
        })
} )
router.delete( '/:productId', ( req, res, next ) => {
    const id = req.params.productId;
    Product.remove( { _id: id } ).then( result => {
        res.status(200).send(result)
    } ).catch( err => {
        res.status( 500 ).send( { error:err } )
    })
} )


module.exports = router