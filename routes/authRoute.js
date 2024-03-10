
import express from 'express';
import { resgisterController, loginController, testController, forgotPasswordController, updateProfileController, getOrdersController, getAllOrdersController, orderStatusController } from "../controllers/authController.js"

import { requireSignIn, isAdmin } from '../middlewares/authMiddleware.js';

// route object 
const router = express.Router()

// routing 
// Register (Method : POST)
router.post('/register', resgisterController);

// Login (Method : POST)
router.post('/login', loginController)

// test route
router.get('/test', requireSignIn, isAdmin, testController)

// Protected Route auth
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ok: true});
});

// Protected Admin Route
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ok: true});
});

// update profile
router.put('/update-profile', requireSignIn, updateProfileController);

// Forgot Pass 
router.post('/forgot-password', forgotPasswordController);




// user orders
// orders
router.get('/orders', requireSignIn, getOrdersController);


// all orders
router.get('/all-orders', requireSignIn, isAdmin, getAllOrdersController);


// order status update
router.put('/order-status/:orderId', requireSignIn, isAdmin, orderStatusController);


export default router;