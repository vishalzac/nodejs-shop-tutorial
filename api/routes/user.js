const express = require( 'express' );
const router = express.Router();
const bcrypt = require('bcrypt')
const User = require( '../../model/user.js' ) 
const jwt = require('jsonwebtoken')


router.post( '/signup', ( req, res ) => {
    User.find( { email: req.body.email } )
        .then( user => {
            if ( user.length >= 1 ) {
                return res.status( 409 ).json( {
                    message: "mail exits"
                } );
            } else {
                bcrypt.hash( req.body.password, 10, ( err, hash ) => {
                    if ( err ) {
                        return res.status( 500 ).json( {
                            error: err
                        } )
                    } else {
                        const user = new User( {
                            email: req.body.email,
                            password: hash
                        } )
                        user.save()
                            .then( result => {
                                console.log( result );
                                res.status( 500 ).json( {
                                    error: err
                                } )
                            } )
                    }
                } )
            }
    })
    
})
router.post( '/login', ( req, res, next ) => {
    User.find( { email: req.body.email } )
        .then( user => {
            if ( user.length < 1 ) {
                return res.status( 401 ).json( {
                message:'Auth failed'
            })
            }
            bcrypt.compare( req.body.password, user[ 0 ].password, ( err, result ) => {
                if ( err ) {
                    return res.status( 401 ).json( {
                        message: 'Auth failed'
                    } );
                }
                if ( result ) {
                    const token = jwt.sign( {
                        email: user[ 0 ].email,
                        userId:user[0]._id
                    }, 'secret', {
                        expiresIn:"1h"
                    })
                    return res.status( 200 ).json( {
                        message: 'Auth sucessful',
                        token:token
                    })
                }
                return res.status( 401 ).json( {
                        message: 'Auth failed'
                    } );
            })
        } )
        .catch( err => {
            console.log( err );
            res.status( 500 ).json( {
                error:err
            })
    })
})
router.delete( "/:userId", ( req, res, next ) => {
    User.remove( { _id: req.params.userId } )
        .then( result => {
            res.status( 200 ).json( {
            message:"User delete"
        })
        } )
        .catch( err => {
            console.log( err );
            res.status( 500 ).json( {
                error:err
            })
    })
})








module.exports = router