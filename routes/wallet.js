const express = require('express');
const { check, body, query, header, validationResult } = require('express-validator');
const walletfunc = require('../controllers/wallet');
const excp = require('../drivers/exceptions');
const router = express.Router();
const wallet = new walletfunc();
const ethfuncs = require('../drivers/ethdrv');
const users = new ethfuncs('ropsten', 3, '04c4d59194974921b49dc457d728b64e');
const web3 = require('web3');
const tokenCtrl = require('../controllers/token');
const Tx = require('ethereumjs-tx').Transaction;
const initapp = require('../initapp')
const token = new tokenCtrl();


/**
 * @swagger
 * 민팅
 */
router.post('/create', excp.wrapAsync(wallet.create));


/**
   * @swagger
   * test
   */
router.post('/mySwapHistory', async function(req, res) {	 

  let data = new Object(); 
  data.result = new Object(); 

    let ret;
    
    // res.render()  
  do{
        // get user profile
        ret = await wallet.getMySwapHistory(req.body.address);

        data.result.code = 200;
        data.swapHistory = ret;
        res.status(data.result.code);

  } while(false);

  res.send(data);
});

   

module.exports = router;