const express = require('express');
const router = express.Router();
const MyAccount = require('../models/myAccount');

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/register', async (req, res, next) => {
    try {
        let {email, password} = req.body
        let user = await MyAccount.create({
            email, 
            password : password
        })
        res.status(201).json({id : user.id, email : user.email})
    } catch (error) {
        next(error)
    }
})

app.post('/login', async (req, res, next) => {
    try {
        let {email, password} = req.body
        if(!email) throw {name : "Email is required"}
        if(!password) throw {name : "Password is required"}
        let user = await MyAccount.findOne({
            where : {
                email
            }
        })
        if(!user) throw {name : "Invalid email/password"}
        let valid = compare(password, user.password)
        if(!valid) throw {name : "Invalid email/password"}
        let access_token = jwt.sign({id : user.id}, "secret")
        res.status(200).json({access_token})
    } catch (error) {
        next(error)
    }
})



module.exports = router;