const express = require("express");
const admin_route =express();
const  nocache = require("nocache")
const multerMiddleware =require('../middleware/multer').upload

const session = require("express-session");
const config = require("../config/config");
//admin_route.use(session({secret:config.sessionSecret}));

admin_route.use(session({
    secret: config.sessionSecret,
    resave: false,  // Set to false to avoid deprecated warning
    saveUninitialized: false  // Set to false to avoid deprecated warning
}));

admin_route.use(nocache());

const bodyParser = require("body-parser");
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}));

admin_route.set('view engine','ejs');
admin_route.set('views','./views/admin');


const auth = require("../middleware/adminAuth");


const adminController = require("../controllers/admin/adminController");
const categoryController=require('../controllers/admin/categoryController');
const orderController=require('../controllers/admin/orderController')
const dashboardController = require("../controllers/admin/dashboardController");
const couponController=require('../controllers/admin/couponController');

admin_route.get('/',auth.isLogout,adminController.loadlogin);
admin_route.post('/',adminController.verifyLogin);





admin_route.get('/home',adminController.loadDashboard);
admin_route.get('/listuser',auth.isLogin,adminController.adminDashboard);
admin_route.get('/logout',auth.isLogin, adminController.adminLogout);

// ----------------------------
admin_route.get('/dashboard/data/custom', auth.isLogin, adminController.customDetails );
admin_route.get('/dashboard/data', auth.isLogin, adminController.dashBoardDetails );

admin_route.get('/top-product-sale',adminController.getTopProductsSale);
admin_route.get('/top-categories',adminController.getTopCategoryies);



// admin_route.get('/deliveredOrders', auth.isLogin,dashboardController.salesReport); 
// admin_route.get('/downloadSalesReport',auth.isLogin, dashboardController.downloadSalesReport); 
// admin_route.get('/dowloadsalesReports',auth.isLogin,dashboardController.downloadSalesReports);
// admin_route.get('/dowloadsalesExcel',auth.isLogin,dashboardController.downloadSalesReportsExcel);
admin_route.get('/getUserDetailsAndOrders', auth.isLogin,dashboardController.getUserDetailsAndOrders); 
// admin_route.get('/getYearlyRevenue', auth.isLogin,dashboardController.getYearlyRevenue); 
admin_route.get('/report',auth.isLogin, auth.isLogin,dashboardController.getDashboardData);
admin_route.get('/dashboard-data',auth.isLogin,dashboardController.dashboardData);











//user mangement
admin_route.get('/listUser',auth.isLogin,adminController.listUser);
admin_route.get('/listUser/block_user/:id',auth.isLogin,adminController.blockUser);


//category Management
admin_route.get('/category',auth.isLogin,categoryController.category);
admin_route.get('/add-category',auth.isLogin,categoryController.addCategory)
admin_route.post('/new-category',auth.isLogin,categoryController.newCategory);
admin_route.get('/load-edit/:categoryId',auth.isLogin,categoryController.LoadEdit);
admin_route.post('/edit-category/:categoryId',auth.isLogin,categoryController.ediCategory)
admin_route.post('/category/:categoryId/update-status', auth.isLogin,categoryController.updateCategoryStatus);
admin_route.delete('/category/:categoryId', auth.isLogin, categoryController.deleteCategory);

// product management
admin_route.get('/product',auth.isLogin,categoryController.product);
admin_route.get('/add-product',auth.isLogin,categoryController.loadProduct)
admin_route.post('/new-product',auth.isLogin, multerMiddleware.array('images', 3),categoryController.addProduct)
admin_route.get('/edit-product/:productId',auth.isLogin,categoryController.LoadEditProduct);
admin_route.post('/edit-product/:productId',auth.isLogin, multerMiddleware.array('images', 3),categoryController.editProduct);
//admin_route.get('/product/:productId',categoryController.deleteProduct);
admin_route.post('/product/:id/update-status',auth.isLogin,categoryController.updateProductStatus);

admin_route.get('/remove-image/:productId/:imageName', auth.isLogin, categoryController.removeImage);
admin_route.post('/add-image/:productId', auth.isLogin,multerMiddleware.array('images',3),categoryController.addImage);

//order management 

admin_route.get('/loadorder',auth.isLogin,orderController.order);
admin_route.post('/update-status/:orderId', auth.isLogin, orderController.updateStatus);
admin_route.post('/confirm-order-cancellation/:orderId',auth.isLogin, orderController.confirmOrderCancellation);

admin_route.get('/canceled-orders',auth.isLogin, orderController.viewCanceledOrders);
admin_route.get('/order-return',auth.isLogin,orderController.viewReturnedOrders);

// coupon management
admin_route.get('/loadcoupon',auth.isLogin,couponController.coupon);
admin_route.get('/add-coupon',auth.isLogin,couponController.LoadaddCoupon);
admin_route.post('/add-coupon',auth.isLogin,couponController.addcoupon);
admin_route.get('/edit-coupon/:couponId',auth.isLogin,couponController.loadeditCoupon);
admin_route.post('/edit-coupon/:couponId',auth.isLogin,couponController.editCoupon);
admin_route.get('/loadcoupon/:couponId',auth.isLogin,couponController.deleteCoupon);

// 
// admin_route.get('/sales-report/', auth.isLogin, admSalesReportController.salesReportGet );
// admin_route.get('/sales-report/:reportType', auth.isLogin, admSalesReportController.customSalesReportGet);
// admin_route.get('/sales/pdf/:reportType', auth.isLogin, admSalesReportController.genPdfGet );
// admin_route.get('/sales-report-total', auth.isLogin, admSalesReportController.salesReportTotalGet );
// admin_route.get('/sales/excel/:reportType', auth.isLogin, admSalesReportController.salesReportExcelGet );

// admin_route.get('/top-categories', auth.isLogin, admSalesReportController.getTopCategories);



admin_route.get('*',function(req,res){

    res.redirect('/admin');

})


module.exports = admin_route;