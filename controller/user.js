const jwt = require('jsonwebtoken');
const Users = require('../model/users');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const imageupload = require('../config/fileUpload');
const sendEmail = require('../helper/sendEmail');
require('dotenv').config({});
const stripe = require('stripe')(process.env.STRIPE_KEY);

let user = new Users();

const updateMsgStatus = async (req, res, next) => {
  const messageId = req.params.messageId;

  if (!messageId) return next({ code: 400, message: 'Bad Request' });
  try {
    const result = await user.updateMsgStatus(messageId);

    if (!result) return next({ code: 404, message: 'no data found' });
    return res.status(201).json({ message: 'Msg Read Status Updated' });
  } catch (error) {
    return next({ code: 401, message: error });
  }
};
const getChats = async (req, res, next) => {
  try {
    // getMsgBWUsers(sender_id, reciever_id)
    const productInfo = [];
    let sender_id = req.params.sendBy;
    let reciever_id = req.params.receiveBy;
    const [result] = await user.getMsgBWUsers(sender_id, reciever_id);
    if (result.length > 0) {
      result.forEach((rowsData) => {
        let data = {
          messageId: rowsData.id,
          sender_id: rowsData.sender_id,
          reciever_id: rowsData.reciever_id,
          message: rowsData.message,
          isRead: rowsData.isRead,
          created_at: rowsData.created_at,
        };
        productInfo.push(data);
      });

      return res.status(201).json({
        chats: productInfo,
      });
    } else {
      return next({ code: 404, message: 'no data found' });
    }
  } catch (error) {
    return next({ code: 401, message: error });
  }
};
const getUserChats = async (req, res, next) => {
  try {
    const productInfo = [];
    let user_id = req.params.userId;
    let result = await user.getMsgsOfUser(user_id);
    result = result?.rows;

    if (result.length > 0) {
      result.forEach((rowsData) => {
        let data = {
          messageId: rowsData.id,
          sender_id: rowsData.sender_id,
          receiver_id: rowsData.reciever_id,
          message: rowsData.message,
          isRead: rowsData.isRead,
          created_at: rowsData.created_at,
          sender_username: rowsData.sender_username,
          receiver_username: rowsData.receiver_username,
        };
        productInfo.push(data);
      });

      return res.status(201).json({
        chats: productInfo,
      });
    } else {
      return res.status(201).json({
        chats: [],
      });
    }
  } catch (error) {
    console.error(error);
    return next({ code: 500, message: error });
  }
};

const sendMsg = async (req, res, next) => {
  const payload = req.body;
  if (!payload.sender_id || !payload.reciever_id || !payload.message)
    return next({ code: 400, message: 'Bad Request' });
  try {
    const result = await user.insertMsg(payload);

    if (!result) return next({ code: 404, message: 'no data found' });
    return res.status(201).json({ message: 'Message Sent' });
  } catch (error) {
    console.error(error);
    return next({ code: 401, message: error });
  }
};

const stripeCheckOut = async (req, res, next) => {
  const { amount, currency, description, card, userId, productId, auctionId } =
    req.body;
  try {
    const token = await stripe.tokens.create({
      card: {
        number: card.number,
        exp_month: card.exp_month,
        exp_year: card.exp_year,
        cvc: card.cvc,
      },
    });

    const charge = await stripe.charges.create({
      amount: amount,
      currency: currency,
      description: description,
      source: token.id,
    });

    await user.updateCartStatus(productId, userId, auctionId);
    await user.updateBiddingTables(auctionId);

    return res
      .status(200)
      .json({ paymentSlip: charge.receipt_url, info: charge });
  } catch (error) {
    return next({ code: 401, message: error.message });
  }
};
const reviewsOnProduct = async (req, res, next) => {
  try {
    const productInfo = [];
    let productId = req.params.productId;
    let result = await user.fetchReviewsOnProduct(productId);
    result = result?.rows;
    if (result.length > 0) {
      result.forEach((rowsData) => {
        let data = {
          userId: rowsData.userId,
          reviewBy: rowsData.username,
          productId: rowsData.productid,
          auctionId: rowsData.auctionid,
          productTitle: rowsData.title,
          rating: rowsData.rating,
          feedback: rowsData.feedback,
        };
        productInfo.push(data);
      });

      return res.status(201).json({
        Reviews: productInfo,
      });
    } else {
      return next({ code: 404, message: 'no data found' });
    }
  } catch (error) {
    return next({ code: 401, message: error });
  }
};
const getBiddingData = async (req, res, next) => {
  try {
    const productInfo = [];
    let auctionid = req.params.auctionid;
    let result = await user.getAllBidsOnAProduct(auctionid);
    result = result?.rows;
    if (result.length > 0) {
      result.forEach((rowsData) => {
        let data = {
          userId: rowsData.userid,
          bidBy: rowsData.username,
          productId: rowsData.productid,
          auctionId: rowsData.auctionid,
          productTitle: rowsData.title,
          bidPrice: rowsData.price,
        };
        productInfo.push(data);
      });

      return res.status(201).json({
        Bids: productInfo,
      });
    } else {
      return next({ code: 404, message: 'no data found' });
    }
  } catch (error) {
    return next({ code: 401, message: error });
  }
};

const giveReview = async (req, res, next) => {
  const payload = req.body;
  // addReivew(productId, userId, auctionId, rating, feedback)
  if (!payload.productId || !payload.auctionId || !payload.userId)
    return next({ code: 400, message: 'Bad Request' });
  try {
    const result = await user.addReivew(payload);

    if (!result) return next({ code: 404, message: 'no data found' });
    return res.status(201).json({ message: 'Review Submitted' });
  } catch (error) {
    return next({ code: 401, message: error });
  }
};
const boughtProducts = async (req, res, next) => {
  try {
    const productInfo = [];
    let userId = req.params.userId;
    const [result] = await user.boughtProducts(userId);
    if (result.length > 0) {
      result.forEach((rowsData) => {
        let data = {
          userId: rowsData.userId,
          username: rowsData.username,
          productId: rowsData.productId,
          auctionId: rowsData.auction_id,
          productTitle: rowsData.title,
          productDescription: rowsData.description,
          quantity: rowsData.quantity,
          image: rowsData.image,
          isPaid: rowsData.isPaid,
          totalAmountToBePaid: rowsData.totalAmount,
        };
        productInfo.push(data);
      });

      return res.status(201).json({
        boughtProducts: productInfo,
      });
    } else {
      return next({ code: 404, message: 'no data found' });
    }
  } catch (error) {
    return next({ code: 401, message: error });
  }
};

const updateListingInfo = async (req, res, next) => {
  const payload = req.body;

  if (
    !payload.productId ||
    !payload.auctionId ||
    !payload.reservePrice ||
    !payload.weight
  )
    return next({ code: 400, message: 'Bad Request' });
  try {
    const result = await user.updateAuctionDetails(payload);

    if (!result) return next({ code: 404, message: 'no data found' });
    return res.status(201).json({ message: 'Listing Details Updated' });
  } catch (error) {
    return next({ code: 401, message: error });
  }
};
const cancelAuction = async (req, res, next) => {
  let productId = req.body.productId;
  let auctionId = req.body.auctionId;

  if (!productId || !auctionId)
    return next({ code: 400, message: 'auctionId or productId Missing' });
  try {
    const result = await user.removeFromAuction(auctionId);
    const updateProductQuantity = await user.updateListStatus(productId);

    if (result && updateProductQuantity) {
      return res.status(201).json({ message: 'Listing Cancelled' });
    } else {
      return next({ code: 404, message: 'no data found' });
    }
  } catch (error) {
    return next({ code: 401, message: error });
  }
};
const auctionSettle = async (req, res, next) => {
  let productId = req.body.productId;
  let auctionId = req.body.auctionId;

  if (productId) {
    try {
      const result = await user.settleAuction(auctionId);
      const updateProductQuantity = await user.updateProductQuantity(productId);

      if (result && updateProductQuantity) {
        let details = await user.getWinnerDetails(auctionId, productId);
        details = details?.rows;

        const price = details[0].highestbid;
        const userId = details[0].highestbidderid;
        const prodId = details[0].productid;

        //flagging all except winner
        await user.updateBiddingTable(auctionId, userId);

        //available review option
        let rating = 0;
        let feedback = 'Feedback here';
        let status = 1;
        await user.reviewInfo(
          productId,
          userId,
          auctionId,
          rating,
          feedback,
          status
        );
        //add to cart
        await user.addDetailsToCart(productId, userId, auctionId, price);

        let getUser = await user.fetchSingleUser(userId);
        getUser = getUser?.rows;

        let getProduct = await user.fetchProductInfo(prodId);
        getProduct = getProduct?.rows;
        const productName = getProduct[0].title;
        const email = getUser[0].email;

        const message = `
            <h2>Auction Winner</h2>
            <p>You have won the Bidding for the Product ${productName} worth RS.${price}.</p>
            <p>Congratulations
            </p>
        `;
        await sendEmail({
          email: email,
          subject: 'Bid',
          html: message,
        });

        // sending email to all the users who bidded and lost
        let lostUser = await user.fetchBiddersWhoLost(auctionId);
        lostUser = lostUser?.rows;
        for (const user of lostUser) {
          const { email, userid, auctionid } = user;

          const message = `
            <h2>Auction Lost</h2>
            <p>You have lost the bid for the Product ${productName}</p>
            <p>Unfortunately, you are out-bidded by Pirce ${price}. Try Again.</p>
          `;

          // Send email for each user
          await sendEmail({
            email: email,
            subject: 'Out-Bidded',
            html: message,
          });
        }
        return res
          .status(201)
          .json({ message: 'Auction Settled Successfully' });
      } else {
        return next({ code: 404, message: 'no data found' });
      }
    } catch (error) {
      return next({ code: 401, message: error.message });
    }
  } else {
    return next({ code: 400, message: 'No Request Found' });
  }
};
const createdProducts = async (req, res, next) => {
  try {
    const productInfo = [];
    let userId = req.params.userId;
    const [result] = await user.createdPprducts(userId);
    if (result.length > 0) {
      result.forEach((rowsData) => {
        let data = {
          userId: rowsData.userId,
          username: rowsData.username,
          productId: rowsData.productId,
          productTitle: rowsData.title,
          productDescription: rowsData.description,
          rate: rowsData.rate,
          quantity: rowsData.quantity,
          image: rowsData.image,
          status: rowsData.status,
          isListed: rowsData.isListed,
          reservePrice: rowsData.reservePrice,
          reserveQuantity: rowsData.reserveQuantity,
          highestBid: rowsData.highestBid,
          endTime: rowsData.endTime,
          createdAt: rowsData.createdAt,
        };
        productInfo.push(data);
      });

      return res.status(201).json({
        createdProducts: productInfo,
      });
    } else {
      return next({ code: 404, message: 'no data found' });
    }
  } catch (error) {
    return next({ code: 401, message: error });
  }
};
const soldProducts = async (req, res, next) => {
  try {
    const productInfo = [];
    let userId = req.params.userId;
    let result = await user.soldProducts(userId);
    result = result?.rows;
    if (result.length > 0) {
      result.forEach((rowsData) => {
        let data = {
          productId: rowsData.productId,
          productTitle: rowsData.title,
          productDescription: rowsData.description,
          soldAmount: rowsData.totalamount,
          image: rowsData.image,
          createdAt: rowsData.createdAt,
        };
        productInfo.push(data);
      });

      return res.status(201).json({
        soldProducts: productInfo,
      });
    } else {
      return next({ code: 404, message: 'no data found' });
    }
  } catch (error) {
    return next({ code: 401, message: error.message });
  }
};
const searchProduct = async (req, res, next) => {
  let title = req.query.title;

  if (title) {
    try {
      const products = [];

      // Use parameterized query to prevent SQL injection
      let result = await user.searchProduct(title);
      result = result.rows;

      // Assuming that the query method returns an array of objects
      if (result) {
        result.forEach((rowsData) => {
          let data = {
            userId: rowsData.userId,
            username: rowsData.username,
            userId: rowsData.userid,
            productId: rowsData.productid,
            isListed: rowsData.islisted,
            productTitle: rowsData.title,
            auctionEnd: rowsData.auctionend,
            productDescription: rowsData.description,
            rate: rowsData.rate,
            quantity: rowsData.quantity,
            quantityType: rowsData.quantitytype,
            weight: rowsData.weight,
            weighttype: rowsData.weighttype,
            count: rowsData.count,
            counttype: rowsData.counttype,
            volume: rowsData.volume,
            volumetype: rowsData.volumetype,
            location: rowsData.location,
            image: rowsData.image,
            status: rowsData.aucstatus,
            isListed: rowsData.isListed,
            auctionId: rowsData.auctionid,
            reservePrice: rowsData.reserveprice,
            reserveQuantity: rowsData.reservequantity,
            highestBidderId: rowsData.highestbidderid,
            highestBid: rowsData.highestbid,
            endTime: rowsData.endTime,
            rating: rowsData.avg_rating,
            createdAt: rowsData.createdAt,
          };
          products.push(data);
        });

        return res.status(201).json({
          products: products,
        });
      } else {
        return next({ products: products });
      }
    } catch (error) {
      return next({ code: 401, message: error.message });
    }
  } else {
    return next({ code: 401, message: 'no data found' });
  }
};
const searchProductByLocation = async (req, res, next) => {
  let location = req.query.location;

  if (location) {
    try {
      const products = [];

      // Use parameterized query to prevent SQL injection
      let result = await user.searchProductByLocation(location);
      result = result.rows;

      // Assuming that the query method returns an array of objects
      if (result) {
        result.forEach((rowsData) => {
          let data = {
            productId: rowsData.productid,
            productTitle: rowsData.title,
            productDescription: rowsData.description,
            rate: rowsData.rate,
            weight: rowsData.weight,
            weighttype: rowsData.weighttype,
            count: rowsData.count,
            counttype: rowsData.counttype,
            volume: rowsData.volume,
            volumetype: rowsData.volumetype,
            location: rowsData.location,
            quantity: rowsData.quantity,
            image: rowsData.image,
            status: rowsData.status,
            isListed: rowsData.isListed,
            createdAt: rowsData.createdAt,
          };
          products.push(data);
        });

        return res.status(201).json({
          products: products,
        });
      } else {
        return next({ products: products });
      }
    } catch (error) {
      return next({ code: 401, message: error.message });
    }
  } else {
    return next({ code: 401, message: 'no data found' });
  }
};

const deleteProducts = async (req, res, next) => {
  /**
     * @dev the payload will contain following properties:
     * - `productId`
   
    
 
     */
  let productId = req.params.productId;

  if (productId) {
    try {
      const result = await user.deleteProduct(productId);

      if (result) {
        return res
          .status(201)
          .json({ message: ' Product deleted Successfully' });
      } else {
        return next({ code: 404, message: 'no data found' });
      }
    } catch (error) {
      return next({ code: 401, message: error });
    }
  } else {
    return next({ code: 400, message: 'No Request Found' });
  }
};
const deleteUsers = async (req, res, next) => {
  /**
     * @dev the payload will contain following properties:
     * - `userId`
   
    
 
     */
  let userId = req.params.userid;

  if (userId) {
    try {
      const result = await user.deleteUser(userId);

      if (result) {
        return res.status(201).json({ message: ' User deleted Successfully' });
      } else {
        return next({ code: 404, message: 'no data found' });
      }
    } catch (error) {
      return next({ code: 401, message: error });
    }
  } else {
    return next({ code: 400, message: 'No Request Found' });
  }
};

const fetchAllProducts = async (req, res, next) => {
  try {
    const productInfo = [];
    const { userId } = req.body;

    let result = await user.fetchAllProducts(userId);
    result = result?.rows;
    if (result.length > 0) {
      result.forEach((rowsData) => {
        console.log(rowsData);
        let data = {
          userId: rowsData.userId,
          username: rowsData.username,
          userId: rowsData.userid,
          productId: rowsData.productid,
          isListed: rowsData.islisted,
          productTitle: rowsData.title,
          auctionEnd: rowsData.auctionend,
          productDescription: rowsData.description,
          rate: rowsData.rate,
          quantity: rowsData.quantity,
          quantityType: rowsData.quantitytype,
          weight: rowsData.weight,
          weighttype: rowsData.weighttype,
          count: rowsData.count,
          counttype: rowsData.counttype,
          volume: rowsData.volume,
          volumetype: rowsData.volumetype,
          location: rowsData.location,
          image: rowsData.image,
          status: rowsData.status,
          isListed: rowsData.isListed,
          auctionId: rowsData.auctionid,
          reservePrice: rowsData.reserveprice,
          reserveQuantity: rowsData.reservequantity,
          highestBidderId: rowsData.highestbidderid,
          highestBid: rowsData.highestbid,
          endTime: rowsData.endTime,
          createdAt: rowsData.createdAt,
        };
        productInfo.push(data);
      });

      return res.status(201).json({
        productInfo: productInfo,
      });
    } else {
      return next({ code: 404, message: 'no data found' });
    }
  } catch (error) {
    console.log(error);
    return next({ code: 500, message: error });
  }
};

const fetchProducts = async (req, res, next) => {
  try {
    const productInfo = [];

    let result = await user.fetchProducts();
    result = result?.rows;

    if (result.length > 0) {
      result.forEach((rowsData) => {
        let data = {
          userId: rowsData.userId,
          username: rowsData.username,
          userId: rowsData.userid,
          productId: rowsData.productid,
          isListed: rowsData.islisted,
          productTitle: rowsData.title,
          auctionEnd: rowsData.auctionend,
          productDescription: rowsData.description,
          rate: rowsData.rate,
          quantity: rowsData.quantity,
          quantityType: rowsData.quantitytype,
          weight: rowsData.weight,
          weighttype: rowsData.weighttype,
          count: rowsData.count,
          counttype: rowsData.counttype,
          volume: rowsData.volume,
          volumetype: rowsData.volumetype,
          location: rowsData.location,
          image: rowsData.image,
          status: rowsData.aucstatus,
          isListed: rowsData.isListed,
          auctionId: rowsData.auctionid,
          reservePrice: rowsData.reserveprice,
          reserveQuantity: rowsData.reservequantity,
          highestBidderId: rowsData.highestbidderid,
          highestBid: rowsData.highestbid,
          endTime: rowsData.endTime,
          rating: rowsData.avg_rating,
          createdAt: rowsData.createdAt,
        };
        productInfo.push(data);
      });

      return res.status(201).json({
        productInfo: productInfo,
      });
    } else {
      return next({ code: 404, message: 'no data found' });
    }
  } catch (error) {
    return next({ code: 500, message: error.message });
  }
};

const fetchAlUsers = async (req, res, next) => {
  try {
    const users = [];

    let result = await user.fetchAllUsers();
    result = result?.rows;

    const modifiedResult = result.map(({ password, ...result }) => result);

    if (modifiedResult.length > 0) {
      return res.status(201).json({
        users: modifiedResult,
      });
    } else {
      return next({ code: 404, message: 'no data found' });
    }
  } catch (error) {
    return next({ code: 401, message: error });
  }
};

const fetchSingleProduct = async (req, res, next) => {
  let id = req.params.id;

  try {
    let data = await user.fetchSingleProduct(id);
    data = data?.rows;
    if (data.length > 0) {
      data.forEach((rowsData) => {
        let data1 = {
          userId: rowsData.userId,
          username: rowsData.username,
          userId: rowsData.userid,
          productId: rowsData.productid,
          isListed: rowsData.islisted,
          productTitle: rowsData.title,
          auctionEnd: rowsData.auctionend,
          productDescription: rowsData.description,
          rate: rowsData.rate,
          quantity: rowsData.quantity,
          quantityType: rowsData.quantitytype,
          weight: rowsData.weight,
          weighttype: rowsData.weighttype,
          count: rowsData.count,
          counttype: rowsData.counttype,
          volume: rowsData.volume,
          volumetype: rowsData.volumetype,
          location: rowsData.location,
          image: rowsData.image,
          status: rowsData.status,
          isListed: rowsData.isListed,
          auctionId: rowsData.auctionid,
          reservePrice: rowsData.reserveprice,
          reserveQuantity: rowsData.reservequantity,
          highestBidderId: rowsData.highestbidderid,
          highestBid: rowsData.highestbid,
          endTime: rowsData.endTime,
          createdAt: rowsData.createdAt,
        };

        return res.status(201).json({
          productInfo: data1,
        });
      });
    } else {
      return next({ code: 404, message: 'no data found' });
    }
  } catch (err) {
    return next({ code: 401, message: err.message });
  }
};

const fetchSingleUser = async (req, res, next) => {
  let id = req.params.id;

  try {
    const [data] = await user.fetchSingleUser(id);
    if (data.length > 0) {
      data.forEach((rowsData) => {
        let data1 = {
          userId: rowsData.userId,
          username: rowsData.username,
          email: rowsData.email,
          description: rowsData.description,
          location: rowsData.location,
          role: rowsData.role,
          cnic: rowsData.cnic,
          image: rowsData.image,
        };

        return res.status(201).json({
          userInfo: data1,
        });
      });
    } else {
      return next({ code: 404, message: 'no data found' });
    }
  } catch (err) {
    return next({ code: 401, message: err });
  }
};
const addProduct = async (req, res, next) => {
  /**
     * @dev the payload will contain following properties:
    
    
     * - `title`,
     * - `description`,
     * - `rate`,
     * - `weight`,
     * - `weighttype`,
     * count,
     * counttype,
     * volume,
     * volumetype 
     * location 
     * - `userId`
 
     */
  let payload = req.body;
  let image = req.file.filename;
  if (payload.title && payload.description && payload.userId) {
    try {
      const result = await user.addProduct(payload, image);

      if (result) {
        return res.status(201).json({ message: ' Product Added Successfully' });
      } else {
        return next({ code: 404, message: 'no data found' });
      }
    } catch (error) {
      console.log(error);
      return next({ code: 401, message: error.message });
    }
  } else {
    return next({ code: 400, message: 'No Request Found' });
  }
};
const updateProductDetails = async (req, res, next) => {
  /**
     * @dev the payload will contain following properties:
    
    
     * - `title`,
     * - `description`,
     * - `rate`,
     * - `weight`,
     * - `weighttype`,
     * count,
     * counttype,
     * volume,
     * volumetype 
     * location 
     * - `userId`
 
     */
  let payload = req.body;

  if (payload.productid && payload.userId) {
    try {
      const result = await user.updateProductDetails(payload);

      if (result) {
        return res
          .status(201)
          .json({ message: ' Product info updated Successfully' });
      } else {
        return next({ code: 404, message: 'no data found' });
      }
    } catch (error) {
      console.log(error);
      return next({ code: 401, message: error.message });
    }
  } else {
    return next({ code: 400, message: 'No Request Found' });
  }
};
const addBid = async (req, res, next) => {
  /**
   * @dev the payload will contain following properties:
   * - `userId`,
   * - `productId`,
   * - `price`,
   * - `auctionId`
   */
  let payload = req.body;

  if (payload.productId && payload.price && payload.userId) {
    try {
      const updateTb = await user.updateAuctionBidding(payload);

      const result = await user.addBid(payload);

      let getUser = await user.fetchSingleUser(payload.userId);
      getUser = getUser.rows;

      if (result && updateTb) {
        return res.status(201).json({ message: ' Bid Added Successfully' });
      } else {
        return next({ code: 404, message: 'no data found' });
      }
    } catch (error) {
      console.log(error);
      return next({ code: 401, message: error });
    }
  } else {
    return next({ code: 400, message: 'No Request Found' });
  }
};
const listOnAuction = async (req, res, next) => {
  /**
     * @dev the payload will contain following properties:
     * - `userId`,
     * - `productId`,
     * - `reservePrice`,
     * - `weight`,
    
 
     */
  let payload = req.body;

  if (payload.productId && payload.reservePrice && payload.userId) {
    try {
      const today = new Date();
      const tenMinutesLater = new Date(today);
      tenMinutesLater.setMinutes(today.getMinutes() + 10);

      const result = await user.listOnAuction(payload);
      await user.updateAuctioned(payload.productId, tenMinutesLater);
      await user.updateListing(payload.productId);

      if (result) {
        return res.status(201).json({
          message: 'Listed on Auction Successfully',
          auctionId: result.rows[0].auctionid,
        });
      } else {
        return next({ code: 404, message: 'no data found' });
      }
    } catch (error) {
      return next({ code: 401, message: error.message });
    }
  } else {
    return next({ code: 400, message: 'No Request Found' });
  }
};
const updateUserInfo = async (req, res, next) => {
  /**
     * @dev the payload will contain following properties:
    

     * - `description`,
     * - `cnic`,
     * - `location`,
     * - `email`,
     * - `userId`,
   
 
     */
  let payload = req.body;

  if (payload.userId) {
    try {
      const result = await user.updateInfo(payload);
      if (result) {
        return res.status(201).json({ message: ' Updated Successfully' });
      } else {
        return next({ code: 404, message: 'no data found' });
      }
    } catch (error) {
      return next({ code: 401, message: error });
    }
  } else {
    return next({ code: 400, message: 'No Request Found' });
  }
};
const updateUserInfoFromAdmin = async (req, res, next) => {
  /**
     * @dev the payload will contain following properties:
    

     * - `description`,
     * - `cnic`,
     * - `location`,
     * - `email`,
     * - `userId`,
   
 
     */
  let payload = req.body;

  if (payload.userId) {
    try {
      const result = await user.updateInfoByAdmin(payload);
      if (result) {
        return res.status(201).json({ message: ' Updated Successfully' });
      } else {
        return next({ code: 404, message: 'no data found' });
      }
    } catch (error) {
      return next({ code: 401, message: error });
    }
  } else {
    return next({ code: 400, message: 'No Request Found' });
  }
};
const updateProfilePic = async (req, res, next) => {
  try {
    if (req.file == undefined) {
      return next({ code: 400, message: 'Please upload a file!' });
    }
    let userId = req.body.userId;

    let image = req.file.filename;

    if (userId && image) {
      try {
        const result = await user.uploadProfilePicture(userId, image);
        if (result) {
          return res.status(201).json({ message: 'Picture Updated' });
        } else {
          return next({ code: 404, message: 'no data found' });
        }
      } catch (error) {
        return next({ code: 401, message: error });
      }
    } else {
      return next({ code: 400, message: 'No Request Found' });
    }
  } catch (err) {
    return res.status(500).json({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};
const signUp = async (req, res, next) => {
  /**
     * @dev the payload will contain following properties:
    
    
     * - `username`,
     * - `email`,
     * - `password`,
     * - `role`,
   
 
     */
  let payload = req.body;
  let checkemail = await user.logIn(payload.email);
  checkemail = checkemail.rows[0];
  if (checkemail)
    return res
      .status(409)
      .json({ message: ' Email Already in Use Please use a different Email' });
  const salt = await bcrypt.genSalt(10);
  payload.password = await bcrypt.hash(payload.password, salt);
  console.log(payload.password);
  if (payload.email && payload.password) {
    try {
      const result = await user.signUp(payload);
      if (result) {
        return res.status(201).json({ message: ' Registered Successfully' });
      } else {
        return next({ code: 404, message: 'no data found' });
      }
    } catch (error) {
      console.error(error);
      return next({ code: 500, message: error.message });
    }
  } else {
    return next({ code: 400, message: 'No Request Found' });
  }
};
const adminSignUp = async (req, res, next) => {
  let payload = {
    username: 'admin',
    email: 'admin@gmail.com',
    password: 'Admin123',
    role: 'admin',
  };
  let checkemail = await user.logIn(payload.email);
  checkemail = checkemail.rows[0];
  if (checkemail)
    return res
      .status(409)
      .json({ message: 'Email Already in Use Please use a different Email' });
  const salt = await bcrypt.genSalt(10);
  payload.password = await bcrypt.hash(payload.password, salt);
  console.log(payload.password);
  if (payload.email && payload.password) {
    try {
      const result = await user.signUp(payload);
      if (result) {
        return res.status(201).json({ message: ' Registered Successfully' });
      } else {
        return next({ code: 404, message: 'no data found' });
      }
    } catch (error) {
      console.error(error);
      return next({ code: 500, message: error.message });
    }
  } else {
    return next({ code: 400, message: 'No Request Found' });
  }
};

const logIn = async (req, res, next) => {
  let email = req.body.email;

  let password = req.body.password;

  if (typeof email != 'undefined' && typeof password != 'undefined') {
    try {
      // console.log(password);
      let data = await user.logIn(email);
      data = data.rows[0];
      if (data?.email) {
        data = [data];

        let check = await bcrypt.compare(password, data[0]?.password);
        if (!check) {
          return next({ code: 403, message: 'Invalid Email or Password' });
        }
        data.forEach((rowsData) => {
          let data1 = {
            userId: rowsData.userid,
            username: rowsData.username,
            email: rowsData.email,
            description: rowsData.description,
            location: rowsData.location,
            role: rowsData.role,
            cnic: rowsData.cnic,
            image: rowsData.image,
          };

          jwt.sign(
            { data1 },
            'secretKey',
            { expiresIn: '1d' },
            (err, token) => {
              if (err) {
                return res.status(401).json({ message: err });
              }
              return res.status(201).json({ userInfo: data1, token: token });
            }
          );
        });
      } else {
        return next({ code: 404, message: 'Invalid Email or Password' });
      }
    } catch (err) {
      console.log(err);
      return next({ code: 500, message: err.message });
    }
  } else {
    return next({ code: 400, message: 'No Request Found' });
  }
};

const authentication = async (req, res, next) => {
  let email = req.data.data1.email;

  if (email) {
    try {
      // console.log(password);
      let data2 = await user.logIn(email);
      const rowsData = data2.rows[0];

      if (rowsData) {
        let data1 = {
          userId: rowsData.userid,
          username: rowsData.username,
          email: rowsData.email,
          description: rowsData.description,
          location: rowsData.location,
          role: rowsData.role,
          image: rowsData.image,
        };

        return res.status(201).json({ userInfo: data1 });
      } else {
        return next({ code: 404, message: 'Invalid Email or Password' });
      }
    } catch (err) {
      return next({ code: 401, message: err.message });
    }
  } else {
    return next({ code: 400, message: 'No Request Found' });
  }
};

const getAuctionsByUserId = async (req, res, next) => {
  let userId = req.params.userId;
  if (userId) {
    try {
      let data = await user.getAuctionsByUserId(userId);

      if (data.length > 0) {
        return res.status(201).json({ auctions: data });
      } else {
        return next({ code: 404, message: 'no data found' });
      }
    } catch (err) {
      console.error(err);
      return next({ code: 401, message: err });
    }
  } else {
    return next({ code: 400, message: 'No Request Found' });
  }
};

const executeBidding = async (req, res, next) => {
  try {
    let products = await user.fetchProducts();
    products = products.rows;

    products.forEach(async (product) => {
      const bidTime = product.auctionend;
      const today = new Date();
      if (bidTime.toDateString() === today.toDateString()) {
        let bids = await user.getBidsByProductId(product.productid);
        bids = bids.rows;

        let highestBid = await user.getHighestBidByProductId(product.productid);
        highestBid = highestBid.rows[0];
        if (highestBid) {
          await user.deleteBidsByProductId(product.productid);
          await user.addDetailsToCart(
            product.productid,
            highestBid.userid,
            1,
            highestBid.price
          );
        }
      }

      return next({ code: 200, message: 'bidding successfully' });
    });
  } catch (err) {
    console.error(err.message);
    return next({ code: 500, message: 'Internal Server Error' });
  }
};

const getCart = async (req, res, next) => {
  const userId = req.params.userId;
  if (!userId) return next({ code: 400, message: 'Bad Request' });
  try {
    let result = await user.getCartByUserId(userId);
    result = result.rows;
    if (!result) return next({ code: 404, message: 'no data found' });
    console.log(result);
    return res.status(201).json({ data: result });
  } catch (error) {
    console.error(error);
    return next({ code: 401, message: error });
  }
};

const pay = async (req, res, next) => {
  try {
    const { cartId, address, postalCode, city, country } = req.body;
    let cart = await user.getCartById(cartId);
    cart = cart.rows[0];
    if (!cart) return next({ code: 404, message: 'no data found' });

    await user.addToShipment({
      userId: cart.userid,
      productId: cart.productid,
      address,
      city,
      country,
      postalCode,
    });

    await user.deleteCartByProductId(cart.productid);
    return res.status(201).json({ message: 'payment successful' });
  } catch (error) {
    console.error(error);
    return next({ code: 401, message: error });
  }
};

const fetchShipmentByUserId = async (req, res, next) => {
  const userId = req.params.userId;
  if (!userId) return next({ code: 400, message: 'Bad Request' });
  try {
    let result = await user.fetchShipmentByUserId(userId);
    result = result.rows;
    if (!result) return next({ code: 404, message: 'no data found' });
    console.trace(result);
    return res.status(201).json({ data: result });
  } catch (error) {
    console.error(error);
    return next({ code: 401, message: error });
  }
};

const deleteProductById = async (req, res, next) => {
  const productId = req.params.productId;
  if (!productId) return next({ code: 400, message: 'Bad Request' });
  try {
    let result = await user.deleteProductById(productId);
    await user.deleteCartByProductId(productId);
    await user.deleteBidsByProductId(productId);
    result = result.rows;
    if (!result) return next({ code: 404, message: 'no data found' });
    console.trace(result);
    return res.status(201).json({ data: result });
  } catch (error) {
    console.error(error);
    return next({ code: 401, message: error });
  }
};

const updateProfile = async (req, res, next) => {
  let userId = req.params.userId;
  userId = parseInt(userId);
  const { username, email, location, cnic } = req.body;

  if (!userId) return next({ code: 400, message: 'Bad Request' });

  try {
    let result = await user.updateProfile({
      userId,
      username,
      email,
      location,
      cnic,
    });
    result = result.rows;
    if (!result) return next({ code: 404, message: 'no data found' });
    return res.status(201).json({ data: result });
  } catch (error) {
    console.error(error);
    return next({ code: 401, message: error });
  }
};

module.exports = {
  userLogin: logIn,
  authentication: authentication,
  signUp: signUp,
  addProduct: addProduct,
  fetchAllProducts: fetchAllProducts,
  fetchSingleProduct: fetchSingleProduct,
  addBid: addBid,
  listOnAuction: listOnAuction,
  updateUserInfo: updateUserInfo,
  fetchSingleUser: fetchSingleUser,
  deleteProducts: deleteProducts,
  deleteUsers: deleteUsers,
  searchProduct: searchProduct,
  fetchAlUsers: fetchAlUsers,
  updateProfilePic: updateProfilePic,
  createdProducts: createdProducts,
  auctionSettle: auctionSettle,
  cancelAuction: cancelAuction,
  updateListingInfo: updateListingInfo,
  boughtProducts: boughtProducts,
  giveReview: giveReview,
  reviewsOnProduct: reviewsOnProduct,
  stripeCheckOut: stripeCheckOut,
  sendMsg: sendMsg,
  getChats: getChats,
  updateMsgStatus: updateMsgStatus,
  getUserChats: getUserChats,
  fetchProducts: fetchProducts,
  getAuctionsByUserId: getAuctionsByUserId,
  executeBidding: executeBidding,
  getCart: getCart,
  pay: pay,
  fetchShipmentByUserId: fetchShipmentByUserId,
  deleteProductById: deleteProductById,
  updateProfile: updateProfile,
  getBiddingData: getBiddingData,
  updateProductDetails: updateProductDetails,
  searchProductByLocation: searchProductByLocation,
  soldProducts: soldProducts,
  adminSignUp: adminSignUp,
  updateUserInfoFromAdmin: updateUserInfoFromAdmin,
};
