const pool = require('../config/database');

module.exports = class Users {
  constructor() {}

  fetchAll() {
    return pool.query(`SELECT * FROM  users
     `);
  }
  fetchAllUsers() {
    return pool.query(`SELECT * FROM users WHERE "role" != 'admin' || 'Admin'
     `);
  }

  fetchProductInfo(prodId) {
    return pool.query(`SELECT * FROM  products WHERE productId = ${prodId}
     `);
  }

  fetchSingleUser(id) {
    return pool.query(`SELECT * FROM  users WHERE userId = ${id}
     `);
  }
  fetchBiddersWhoLost(auctionId) {
    return pool.query(`SELECT b.userid,b.auctionid,b.status,u.email as email FROM bidding b
    JOIN users u ON (b.userid = u.userid)
    
    WHERE b.auctionid = ${auctionId} AND b.status = 0
     `);
  }

  fetchAllProducts(userId) {
    return pool.query(
      `SELECT DISTINCT p.*, u.userId, u.username,ac.productId as auctionProduct,ac.auctionId,ac.reserveprice,ac.highestbidderid,ac.highestbid,ac.endTime,ac.status as aucStatus FROM products p
      JOIN users u ON
      (p.userId = u.userId)
      LEFT JOIN auction ac ON
      (p.productId = ac.productId
        AND
        ac.status = 1)
      WHERE p.userid= ${userId}
      `
    );
  }
  getReviews(productid) {
    return pool.query(
      `SELECT rating FROM review
      WHERE prod_id= ${productid}
      `
    );
  }

  fetchProducts() {
    return pool.query(
      `SELECT 
      p.*,
      u.userId,
      u.username,
      ac.productId as auctionProduct,
      ac.auctionId,
      ac.reserveprice,
      ac.highestbidderId,
      ac.highestbid,
      ac.endTime,
      ac.status as aucstatus,
      ROUND(COALESCE(AVG(CAST(r.rating AS DECIMAL)), 0), 1) AS avg_rating
  FROM 
      products p
  JOIN 
      users u ON (p.userId = u.userId)
  LEFT JOIN 
      auction ac ON (p.productId = ac.productId AND ac.status = 1)
  LEFT JOIN 
      review r ON (p.productId = r.prod_id)
  GROUP BY 
      p.productId, u.userId, u.username, ac.productId, ac.auctionId, ac.reserveprice, ac.highestbidderId, ac.highestbid, ac.endTime, ac.status;
      `
    );
  }

  getBidsByProductId(productId) {
    return pool.query(
      `SELECT b.*, u.userid, u.username
      FROM bidding b
      JOIN users u ON b.userid = u.userid
      WHERE b.productid = $1`,
      [productId]
    );
  }

  getHighestBidByProductId(productId) {
    return pool.query(
      `SELECT b.*
      FROM bidding b
      WHERE b.productid = $1
      ORDER BY b.price DESC
      LIMIT 1`,
      [productId]
    );
  }

  updateProfile({ userId, username, email, cnic, location }) {
    return pool.query(
      `UPDATE users 
       SET username = $1, email = $2, cnic = $3, location = $4
       WHERE userid = $5`,
      [username, email, cnic, location, userId]
    );
  }

  fetchSingleProduct(productId) {
    return pool.query(`SELECT p.*, u.userid, u.username,ac.productid as auctionproduct,ac.auctionid,ac.reserveprice,ac.highestbidderId,ac.highestbid,ac.endTime,ac.status as aucStatus FROM products p
    JOIN users u ON
    (p.userid = u.userid)
    LEFT JOIN auction ac ON
   (p.productid = ac.productid AND ac.createdat = (
      SELECT MAX(createdat)
      FROM auction
      WHERE productid = p.productid
  ))
    WHERE
    p.productid= ${productId}
     `);
  }

  logIn(email) {
    return pool.query(`SELECT * FROM  users
    where
    email = '${email}' `);
  }

  /**
   * @dev the function will create new record for given `payload`
   * @param {Object} payload is an object. it will contain following properties:
   * - `id `,
   * - `full_name`,
   * - `email`,
   * - `phone`,
   * - `bussiness_name`,
   * - `address`,
 
 
   *
   * @returns it will rertun a Promise <fulfiled | rejected>
   */
  updateInfo({ description, cnic, email, location, userId }) {
    return pool.query(`UPDATE users SET description = '${description}', cnic = '${cnic}' , email = '${email}', location = '${location}'
WHERE
userId = '${userId}'
`);
  }

  updateInfoByAdmin({
    username,
    description,
    cnic,
    email,
    role,
    location,
    userId,
  }) {
    return pool.query(`UPDATE users SET username = '${username}', description = '${description}', cnic = '${cnic}' , email = '${email}',role = '${role}', location = '${location}'
WHERE
userId = '${userId}'
`);
  }

  uploadProfilePicture(userId, image) {
    return pool.query(`UPDATE users SET image = '${image}'
WHERE
userId = '${userId}'
`);
  }

  signUp({ username, email, password, role }) {
    return pool.query(
      'INSERT INTO users (username, email, password, role, image) VALUES ($1, $2, $3, $4, $5)',
      [username, email, password, role, 'default_image.jpg']
    );
  }

  addProduct(
    {
      title,
      description,
      rate,
      weight,
      weighttype,
      count,
      counttype,
      volume,
      volumetype,
      userId,
      location,
      auctionend,
    },
    image
  ) {
    return pool.query(
      'INSERT INTO products (title, description, image, rate, weight,weighttype,count,counttype,volume,volumetype, userId,location, auctionend) VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9,$10,$11,$12,$13)',
      [
        title,
        description,
        image,
        rate,
        weight,
        weighttype,
        count,
        counttype,
        volume,
        volumetype,
        userId,
        location,
        auctionend,
      ]
    );
  }
  updateProductDetails({
    productTitle,
    productDescription,
    rate,
    weight,
    weighttype,
    count,
    counttype,
    volume,
    volumetype,
    userId,
    location,

    productid,
  }) {
    return pool.query(
      'UPDATE products SET title = $1, description=$2, rate=$3, weight=$4,weighttype=$5,count=$6,counttype=$7,volume=$8,volumetype=$9, userId=$10,location=$11 WHERE productid=$12',
      [
        productTitle,
        productDescription,
        rate,
        weight,
        weighttype,
        count,
        counttype,
        volume,
        volumetype,
        userId,
        location,
        productid,
      ]
    );
  }

  addBid({ userId, productId, price, auctionId }) {
    return pool.query(
      `INSERT INTO bidding (userid, productid, price, auctionid) 
      VALUES ($1, $2, $3, $4)`,
      [userId, productId, price, auctionId]
    );
  }

  updateAuctionBidding({ userId, price, productId, endTime, auctionId }) {
    return pool.query(
      `UPDATE auction
      SET highestbidderid = $1, highestbid = $2, endtime = $3
      WHERE productid = $4 AND auctionid = $5 AND status = 1`,
      [userId, price, endTime, productId, auctionId]
    );
  }

  listOnAuction({ userId, productId, reservePrice, weight }) {
    return pool.query(
      `INSERT INTO auction (userId, productId, reservePrice, weight) 
      VALUES ($1, $2, $3, $4)
      RETURNING *`, // Use RETURNING * to return all columns of the inserted row
      [userId, productId, reservePrice, weight]
    );
  }

  updateListing(productId) {
    return pool.query(
      `UPDATE products
      SET isListed = 1
      WHERE productId = $1`,
      [productId]
    );
  }
  updateAuctioned(productId, today) {
    return pool.query(
      `UPDATE products
      SET auctionend = $1
      WHERE productid = $2`,
      [today, productId]
    );
  }

  deleteUser(userId) {
    return pool.query(`DELETE FROM users
WHERE
userid  = ${userId}
`);
  }
  deleteProduct(productId) {
    return pool.query(`DELETE FROM products
WHERE
productId   = ${productId}
`);
  }
  searchProduct(title) {
    return pool.query(
      ` SELECT 
      p.*,
      u.userId,
      u.username,
      ac.productId as auctionProduct,
      ac.auctionId,
      ac.reserveprice,
      ac.highestbidderId,
      ac.highestbid,
      ac.endTime,
      ac.status as aucstatus,
      ROUND(COALESCE(AVG(CAST(r.rating AS DECIMAL)), 0), 1) AS avg_rating
  FROM 
      products p
  JOIN 
      users u ON (p.userId = u.userId)
  LEFT JOIN 
      auction ac ON (p.productId = ac.productId AND ac.status = 1)
  LEFT JOIN 
      review r ON (p.productId = r.prod_id)
      WHERE
      p.title ILIKE $1
  GROUP BY 
      p.productId, u.userId, u.username, ac.productId, ac.auctionId, ac.reserveprice, ac.highestbidderId, ac.highestbid, ac.endTime, ac.status
   
  `,
      ['%' + title + '%']
    );
  }
  searchProductByLocation(location) {
    return pool.query('SELECT * FROM products WHERE location ILIKE $1', [
      '%' + location + '%',
    ]);
  }
  createdPprducts(userId) {
    return pool.query(`SELECT p.*, u.userId, u.username,ac.productId as auctionProduct,ac.auctionId,ac.reservePrice,ac.highestBidderId,ac.highestBid,ac.endTime,ac.status as aucStatus FROM products p
    JOIN users u ON
    (p.userId = u.userId)
    LEFT JOIN auction ac ON
    (p.productId = ac.productId
      AND ac.status = 1)
    WHERE
    u.userId = ${userId}

     `);
  }
  soldProducts(userId) {
    return pool.query(`SELECT p.*, c.* FROM products p, cart c
    WHERE
        (p.productid = c.productid)
        AND
        p.userid = ${userId}

     `);
  }
  updateProductQuantity(productId) {
    return pool.query(`UPDATE products SET islisted = 0
WHERE
productid = ${productId}
`);
  }
  settleAuction(auctionId) {
    return pool.query(`UPDATE auction SET status = 0
     WHERE
auctionId  = ${auctionId}
`);
  }
  updateBiddingTable(auctionId, userId) {
    return pool.query(`UPDATE bidding SET status = 0
     WHERE
auctionId  = ${auctionId}
AND
userid != ${userId}
`);
  }
  updateBiddingTables(auctionId) {
    return pool.query(`UPDATE bidding SET status = 0
     WHERE
auctionId  = ${auctionId}

`);
  }
  updateAuctionDetails({ auctionId, productId, reservePrice, weight }) {
    return pool.query(`UPDATE auction SET reservePrice = ${reservePrice}, quantity ='${weight}'
     WHERE
auctionId  = ${auctionId}
AND
productId = ${productId}
`);
  }
  removeFromAuction(auctionId) {
    return pool.query(`DELETE FROM auction
     WHERE
auctionid  = ${auctionId}
`);
  }
  updateListStatus(productId) {
    return pool.query(`UPDATE products SET islisted = 0
    WHERE
    productId = ${productId}
`);
  }
  getWinnerDetails(acutionId, productId) {
    return pool.query(`SELECT * FROM  auction WHERE auctionid = ${acutionId} AND productid = ${productId}
     `);
  }
  reviewInfo(productId, userId, auctionId, rating, feedback, status) {
    return pool.query(
      `
        INSERT INTO review (prod_id, user_id, auction_id,rating, feedback,status)
        VALUES ($1,$2,$3,$4,$5,$6)
    `,
      [productId, userId, auctionId, rating, feedback, status]
    );
  }

  addReivew({ productId, userId, auctionId, rating, feedback }) {
    return pool.query(`UPDATE review SET rating = ${rating}, feedback = '${feedback}', status = 1 WHERE
     prod_id  = ${productId}
     AND
     user_id  = ${userId} 
     AND
     auction_id  = ${auctionId}
`);
  }

  addDetailsToCart(productId, userId, auctionId, price, weight = 100) {
    return pool.query(
      `INSERT INTO cart (productid, userid,auction_id, totalamount,weight)
       VALUES ($1, $2, $3, $4,$5)`,
      [productId, userId, auctionId, price, weight]
    );
  }

  getCartById(cartId) {
    return pool.query(
      `
      SELECT * FROM cart WHERE id = $1
      `,
      [cartId]
    );
  }

  addToShipment({ userId, productId, address, city, country, postalCode }) {
    return pool.query(
      `INSERT INTO shipment (userId, productId, address, city, country, postalCode, quantity)
       VALUES ($1, $2, $3, $4, $5, $6, 1)`,
      [userId, productId, address, city, country, postalCode]
    );
  }

  deleteProductById(productId) {
    return pool.query(
      `
      DELETE FROM products WHERE productId = $1
      `,
      [productId]
    );
  }

  deleteCartByProductId(productId) {
    return pool.query(
      `
      DELETE FROM cart WHERE productid = $1
      `,
      [productId]
    );
  }

  fetchShipmentByUserId(userId) {
    return pool.query(
      `
      SELECT * FROM shipment WHERE userId = $1
      `,
      [userId]
    );
  }

  deleteBidsByProductId(productId) {
    return pool.query(`DELETE FROM bidding
      WHERE
      productId  = ${productId}
      `);
  }

  getCartByUserId(userId) {
    return pool.query(
      `
      SELECT * FROM cart WHERE userId = $1
      `,
      [userId]
    );
  }

  deleteProductById(productId) {
    return pool.query(
      `
      DELETE FROM products WHERE productId = $1
      `,
      [productId]
    );
  }

  async getAuctionsByUserId(userId) {
    try {
      const query = `
        SELECT a.*, p.* 
        FROM bidding a
        JOIN products p ON a.productid = p.productid
        WHERE a.userid = $1
      `;

      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching auctions:', error);
      throw error;
    }
  }

  boughtProducts(userId) {
    return pool.query(`SELECT p.*, u.userId, u.username,c.userId,c.auction_id , c.productId ,c.quantity,c.totalAmount,c.isPaid,c.createdAt FROM products p, users u, cart c
    WHERE
    u.userId= c.userId
    AND
    p.productId= c.productId
    AND
    u.userId = ${userId}
    

     `);
  }
  fetchReviewsOnProduct(productId) {
    return pool.query(`SELECT p.*, u.userId, u.username,r.user_id,r.auction_id, r.prod_id,r.rating,r.feedback FROM products p, users u, review r
    WHERE
    u.userId= r.user_id
    AND
    p.productId= r.prod_id
    AND
    p.productId = ${productId}
     `);
  }
  getAllBidsOnAProduct(auctionid) {
    return pool.query(`SELECT p.*, u.userid, u.username,a.userid,a.auctionid, a.productid,a.price,a.status, ac.auctionid, ac.status FROM products p, users u, bidding a, auction ac
    WHERE
    u.userid= a.userid
    AND
    p.productid= a.productid
    AND
    ac.productid = a.productid
    AND
    a.status = 1
    AND
    ac.status = 1
    AND
    a.auctionid = ${auctionid}
     `);
  }
  updateCartStatus(productId, userId, auctionId) {
    return pool.query(`UPDATE cart SET ispaid = 1
     WHERE
     productid   = ${productId}
     AND
      userid   = ${userId}
      AND
      auction_id  = ${auctionId}
`);
  }

  insertMsg({ sender_id, reciever_id, message }) {
    return pool.query(
      'INSERT INTO chat (sender_id, reciever_id, message) VALUES ($1, $2, $3)',
      [sender_id, reciever_id, message]
    );
  }

  getMsgBWUsers(sender_id, reciever_id) {
    return pool.query(
      `
      SELECT * FROM chat
      WHERE (sender_id = $1 AND reciever_id = $2)
      OR (sender_id = $2 AND reciever_id = $1)
      ORDER BY created_at
    `,
      [sender_id, reciever_id]
    );
  }

  getMsgsOfUser(user_id) {
    return pool.query(
      `
      SELECT chat.*, 
             sender.username AS sender_username, 
             receiver.username AS receiver_username 
      FROM chat
      LEFT JOIN users AS sender ON chat.sender_id = sender.userid
      LEFT JOIN users AS receiver ON chat.reciever_id = receiver.userid
      WHERE chat.sender_id = $1 OR chat.reciever_id = $1
      ORDER BY chat.created_at
      `,
      [user_id]
    );
  }

  updateMsgStatus(messageId) {
    return pool.query(`UPDATE chat SET isRead = 1
     WHERE
     id = ${messageId}
`);
  }
};
