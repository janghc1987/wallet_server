const express = require('express');
const { check, body, query, header, validationResult } = require('express-validator');
const adminFunc = require('../controllers/admin');
const excp = require('../drivers/exceptions');
const router = express.Router();
const admin = new adminFunc();

/**
 * @swagger
 * 로그인
 */
 router.post('/login', excp.wrapAsync(admin.login));
 
/**
 * @swagger
 * 배너관리
 */
router.post('/bannerList', async function(req, res) {	 

let data = new Object(); 
data.result = new Object(); 

  let ret;
  
  // res.render()  
do{
      // get user profile
      ret = await admin.getMySwapHistory();

      data.result.code = 200;
      data.swapHistory = ret;
      res.status(data.result.code);

} while(false);

res.send(data);
});






module.exports = router;