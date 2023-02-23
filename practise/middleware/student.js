const express = require('express')

const stuData = ( req, res, next ) => {
    try {
    console.log('middleware work sending to next function id=f you see res')
    next();
    } catch ( err ) {
        res.send( err )
        console.log( err );
    }
    
}



module.exports = stuData