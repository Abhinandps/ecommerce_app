const express = require('express')
const router = express.Router();

const adminAuth = require("../Controllers/adminAuth")

router.get('/login',(req,res)=>{
    res.render('admin/login')
})

router.get('/',(req,res)=>{
    res.render('admin/dashboard')
})


router.post('/register',adminAuth.register)
router.post('/login',adminAuth.login)
router.get('/logout',adminAuth.logout)



  

module.exports = router