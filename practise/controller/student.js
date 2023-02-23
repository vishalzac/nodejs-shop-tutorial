const express = require('express')

const stuData = ( req, res ) => {
    try {
        return res.send('student file working')
    } catch ( err ) {
        console.log(err)
    }
    
}



module.exports = stuData