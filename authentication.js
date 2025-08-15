const jwt = require('jsonwebtoken')
const express= require('express')

const verifyUser=(req, res, next)=>{

    const token= req.cookies.token

    if(!token){
        res.redirect('/login')
    }

    try{
        const decode= jwt.verify(token,'abc')
        req.user= decode
        next();
    }catch(error){
        return res.status(401).send("Unauthorized: Invalid Token");

    }
}

module.exports = verifyUser;