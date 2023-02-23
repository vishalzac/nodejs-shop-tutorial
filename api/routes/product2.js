const express = require( 'express' );
const Product = require( '../../model/product2.js' );
const router = express.Router();
const multer = require( 'multer' )
const upload = multer( { dest: 'uploads/' } );

// const storage = multer.diskStorage( {
//     destination: function ( req, file, cb ) {
//         cb(null,'../uploads/')
//     },
//     filename: function ( req, file, cb ) {
//         cb( null, new Date().toISOString() + file.originalname );
//     }
// })

// const upload = multer( { storage: storage } );   //save file destination

router.get( '/', ( req, res, next ) => {
    Product.find({}).select( 'name price _id productImage' ).then( docs => {
        const response = {
            products: docs.map( doc => {
                return {
                    _id: doc._id,
                    productImage:doc.productImage,
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
router.post( '/',upload.single('productImage'), ( req, res, next ) => {
    console.log(req.file)
    const product = new Product( {
        name: req.body.name,
        price: req.body.price,
        productImage:req.file.path
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