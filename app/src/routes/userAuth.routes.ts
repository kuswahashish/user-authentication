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

router.get('/home', (req, res) => {
  res.render('home');
})
router.get('/add-product', (req, res) => {
  res.render('add-product');
})

router.get('/view-product', (req, res) => {
  res.render('product-list');
})
router.get('/product-detail', (req, res) => {
  res.render('product-view');
})

router.get('/add-user', (req, res) => {
  res.render('add-user');
})
router.get('/view-users', (req, res) => {
  res.render('user-list');
})

router.get('/user-profile', (req, res) => {
  res.render('profile');
})

router.get('/edit-profile', (req, res) => {
  res.render('edit-profile');
})

router.get('/my-cart', (req, res) => {
  res.render('cart');
})

router.get('/change-password', (req, res) => {
  res.render('change-password');
})
export default router;



