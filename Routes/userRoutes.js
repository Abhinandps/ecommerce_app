
const express = require('express')
const router = express.Router();


const auth = require('../Controllers/auth')

router.get('/signup',(req,res)=>{
    res.render('signup')
})


router.get('/', (req, res) => {
    res.render('home')
  });
//   auth.handleSignupErrors
router.post('/signup',auth.signup)


// Render the OTP verification form
router.get('/verify-otp', auth.renderVerifyOTP);

// Verify the OTP
router.post('/verify-otp', auth.verifyOTP);

router.post('/login',auth.login)

router.get('/logout',auth.logout)

module.exports = router
