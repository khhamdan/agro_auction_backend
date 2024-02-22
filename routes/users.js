const express = require('express');
const auth = require('../middleware/validation');
const userController = require('../controller/user');
const validate = require('../helper/validate');
const { upload } = require('../controller/upload');
const fileUpload = require('../config/fileUpload');
const router = express.Router();

router.get('/checkSession', auth, userController.authentication);

router.post('/signup', [validate.signUp], userController.signUp);
router.post('/adminSignUp', userController.adminSignUp);

router.post('/login', userController.userLogin);

router.post('/addProduct', upload.single('image'), userController.addProduct);
router.post('/updateProductInfo', userController.updateProductDetails);
router.post('/uploadProfilePic', fileUpload, userController.updateProfilePic);
router.get('/createdProducts/:userId', userController.createdProducts);
router.get('/soldProductsByFarmer/:userId', userController.soldProducts);
router.get('/boughtProducts/:userId', userController.boughtProducts);
router.post('/listOnAuction', userController.listOnAuction);
router.post('/addBid', userController.addBid);
router.post('/settleAuction', userController.auctionSettle);
router.post('/cancelAuction', userController.cancelAuction);
router.post('/updateAuctionDetails', userController.updateListingInfo);
router.post('/updateUserInfo', userController.updateUserInfo);
router.post('/updateUserInfoFromAdmin', userController.updateUserInfoFromAdmin);
router.post('/getAllProducts', userController.fetchAllProducts);
router.post('/getProducts', userController.fetchProducts);
router.get('/getAllUsers', userController.fetchAlUsers);
router.get('/getSingleProduct/:id', userController.fetchSingleProduct);
router.get('/getSingleUser/:id', userController.fetchSingleUser);
router.get('/deleteUser/:userid', userController.deleteUsers);
router.get('/deleteProduct/:productId', userController.deleteProducts);
router.get('/searchProduct', userController.searchProduct);
router.get('/searchProductByLocation', userController.searchProductByLocation);
router.get('/getAuctionsByUserId/:userId', userController.getAuctionsByUserId);
router.get('/executeBidding', userController.executeBidding);
router.get('/getCart/:userId', userController.getCart);
router.post('/pay', userController.pay);
router.get('/shipments/:userId', userController.fetchShipmentByUserId);
router.get('/delete/product/:productId', userController.deleteProductById);
router.post('/addReview', userController.giveReview);
router.get('/getReviews/:productId', userController.reviewsOnProduct);
router.get('/getBidHistory/:auctionid', userController.getBiddingData);
router.post('/checkOut', userController.stripeCheckOut);
router.post('/sendMessage', userController.sendMsg);
router.get('/getChat/:sendBy/:receiveBy', userController.getChats);
router.get('/getChatUsers/:userId', userController.getUserChats);
router.get('/updateMsgStatus/:messageId', userController.updateMsgStatus);
router.post('/update/profile/:userId', userController.updateProfile);

module.exports = router;
