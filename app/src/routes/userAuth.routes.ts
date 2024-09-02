import { Router } from 'express';

const router = Router();

import { userAuthControl } from '../controllers/userAuth.controller';
import { authToken } from '../services/authToken.service';

router.post('/login', userAuthControl.userLogin)
router.post('/forgot-password', userAuthControl.forgotPassword)
router.post('/reset-password', authToken.verifyAuthToken, userAuthControl.resetPassword)
router.put('/change-password', authToken.verifyAuthToken, userAuthControl.changePassword)
router.get('/logout', authToken.verifyAuthToken, userAuthControl.logOut)
router.get('/token', userAuthControl.getToken)
router.post('/otp-verify', userAuthControl.otpVerify)

// view routes
router.get('/login', (req, res) => {
  res.render('login');
})

router.get('/register', (req, res) => {
  res.render('register');
})

router.get('/verify', (req, res) => {
  res.render('verify');
})
router.get('/forgot-password', (req, res) => {
  res.render('forgot');
})
router.get('/reset-password', (req, res) => {
  res.render('reset');
})
export default router;



