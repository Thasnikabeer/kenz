const express = require("express");
const router = express.Router();
const addressController=require('../controllers/user/address');
const passport = require('passport'); //for login using google

router.use(passport.initialize());
router.use(passport.session());  //for login using google
const userController = require('../controllers/user/userController');
router.get('/verify',userController.verify)

const couponController=require('../controllers/user/couponController')
const razorpayInstance=require('../config/razorpayConfig')
const invoiceController = require('../controllers/user/invoiceController');

const auth=require('../middleware/auth')
const multer=require('multer');
const path=require('path');
const session = require("express-session");
const config = require("../config/config");
router.use(session({
    secret: config.sessionSecret,
    resave: false,  // Set to false to avoid deprecated warning
    saveUninitialized: false  // Set to false to avoid deprecated warning
}));

// 
router.get('/google/Verify', passport.authenticate('google', {
    scope: ['email', 'profile']
}));

// router.get('/userVerification/google', (req, res, next) => {
//     passport.authenticate('google', async (err, user, info) => {
//         if (err) {
//             return next(err);
//         }
//         if (!user) {
//             return res.redirect('/failed'); 
//         }
//         req.logIn(user, async (err) => {
//             if (err) {
//                 return next(err);
//             }
//             // Pass the email to the user controller
//             await Controller.handleGoogleSuccess(req, res, user.email);
//         });
//     })(req, res, next);
// }); 
router.get("/userVerification/google/callback/",passport.authenticate("google", { failureRedirect: "/failed" }),userController.handleGoogleSuccess);


const storage=multer.diskStorage({
    destination:function (req,file,cb) {
        cb(null,path.join(__dirname,'../public/userImage'))
    },
    filename:function(req,file,cb){
        // const name =Date.now()+'-'+file.originalname;
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        // cb(null,name);
    }
})

const multerUpload = multer({storage: storage});
const {upload}=require('../middleware/imageMulter')
// user sign in and register
router.get('/register',auth.isLogout, userController.register);
router.post('/register',multerUpload.single('image'),userController.userData);
router.post('/verify/:userId', userController.verify);
router.get('/login',auth.isLogout, userController.login);
router.post('/login', userController.verifylogin);
router.get("/", auth.isLogout,userController.homepage);
router.get("/home", auth.isLogged,userController.homepage);
router.get('/email-verified', userController.emailVerified);
router.get('/logout',auth.isLogged,userController.userLogout);
router.post('/resend-otp/:userId',userController.resendOTP);

// user profile managment
router.get('/editProfileImage',auth.isLogged, userController.viewEditProfileImage);
router.post('/updateProfileImage', auth.isLogged,upload.single('image'), userController.updateProfileImage);
router.get('/profile',auth.isLogged,userController.viewProfile);
router.get('/editProfileForm',auth.isLogged,userController.viewEditProfileForm);
router.post('/updateProfile',auth.isLogged,userController.updateProfile);
router.get ('/change-password',auth.isLogged,userController.loadchangepassword);
router.post('/changepass',auth.isLogged,userController.changepassword);
router.get('/forgot',userController.forgotLoad);
router.post('/forgot',userController.forgotPass);
router.get('/forgot-password',auth.isLogged,userController.forgotpassword);
router.post('/forgot-password',auth.isLogged,userController.restPassword);
// user product 
router.get('/product-list',userController.viewProductList);
router.get('/product/:productId',userController.viewProduct);
router.get('/view-offered-categories', userController.viewOfferedCategories);
router.get('/category/:categoryId/products', userController.viewOfferedCategoriesProducts);
router.get('/errorload',userController.errorload)
// user address
router.get('/address',auth.isLogged,addressController.loadAddress);
router.get('/add-Address',auth.isLogged,addressController.loadaddAddress);
router.post('/add-Address',addressController.addAddress);
router.get('/update-address/:addressId',auth.isLogged,addressController.loadEditAddress);
router.post('/update-address/:addressId',auth.isLogged,addressController.updateAddress);
router.get('/delete-address/:addressId',auth.isLogged,addressController.deleteAddress);

// user cart
router.get('/cartList',auth.isLogged,userController.loadCartList);
router.get('/add-to-cart/:productId',userController.addtoCart);
router.get('/deleteCartItem/:userId/:productId',userController.deleteCart);
router.post('/updateCartItemQuantity/:productId',userController.updateQuantity)

//checkout-address router
router.get('/chooseAddress',auth.isLogged,addressController.chooseAddress);
router.post('/SelectedAddress',auth.isLogged,addressController.SelectedAddress);
router.get('/choose-addAddress',auth.isLogged,addressController.chooseaddAddress);
router.post('/addnewaddress',auth.isLogged,addressController.addnewAddress);
router.get('/edit-address/:addressId',auth.isLogged,addressController.loadAddressEdit);
router.post('/edit-address/:addressId',auth.isLogged,addressController.editAddress);
router.get('/delete-chooseaddress/:addressId',auth.isLogged,addressController.deletechooseAddress);

//checkout

router.get('/checkout',auth.isLogged,userController.loadcheckout);
router.get('/ordersucess',auth.isLogged,userController.orderSucess);
router.post('/place-order',auth.isLogged,userController.placeorder);

//orderManagement
router.get('/order-history', auth.isLogged, userController.loadorderHistory);
router.post('/cancel-order/:orderId', auth.isLogged, userController.orderCancel);
router.get('/reasonpage/:orderId', auth.isLogged, userController.reasonpage);
router.get('/view-order/:orderId', auth.isLogged,userController.viewOrder);
router.post('/orders/:orderId/return', auth.isLogged,userController.requestReturn);

// whitelist
router.get('/wishlist' ,auth.isLogged,userController.whitelist);
router.get('/addwhitelist/:productId',auth.isLogged,userController.addwhitelist);
router.get('/wishlist/:productId',auth.isLogged,userController.deletewishlist);

// wallet
router.get('/wallet',auth.isLogged,userController.wallet);

//coupon management
router.get('/loadcoupon',auth.isLogged,couponController.loadCoupon);
router.post('/applycoupon', auth.isLogged, couponController.applyCoupon);
router.post('/removecoupon', auth.isLogged, couponController.removeCoupon);

//Razorpay
router.get('/razorpayPage',userController.razorpayPage)
router.post('/capture-payment',userController.capturePayment)
router.post('/handle-payment-failure',userController.handlePaymentFailure);
router.post('/razorpay-callback', userController.handleRazorpayCallback);
router.post('/retryRazorpay', userController.retryRazorpay);
router.get('/razorpayPage2', userController.razorpayPage2);
router.post('/capturePayment2', userController.capturePayment2);
router.get('/handlePaymentFailure2', userController.handlePaymentFailure2);

router.post('/invoices/from-order/:orderId', invoiceController.createInvoiceFromOrder);
router.get('/invoices/:id/pdf', invoiceController.generateInvoicePdf);



router.post('/payment-success', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id } = req.body;
    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

    if (!order) {
      return res.status(400).send('Order not found');
    }

    const paymentDetails = await razorpayInstance.payments.fetch(razorpay_payment_id);

    if (paymentDetails.status === 'captured') {
      order.status = 'Submitted';
      order.paymentStatus = 'Paid';
      await order.save();

      res.redirect('/order-history'); // Redirect to order history page
    } else {
      res.redirect('/payment-failure');
    }
  } catch (error) {
    console.error('Error in payment success:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/payment-failure', async (req, res) => {
  try {
    const razorpayOrderId = req.query.razorpay_order_id; // Adjust based on how Razorpay sends failure data
    const order = await Order.findOne({ razorpayOrderId });

    if (!order) {
      return res.status(400).send('Order not found');
    }

    order.status = 'Failed';
    order.paymentStatus = 'Failed';
    await order.save();

    res.redirect('/order-history'); // Redirect to order history page
  } catch (error) {
    console.error('Error in payment failure:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;