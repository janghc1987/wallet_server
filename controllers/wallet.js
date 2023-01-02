
const jwt = require('jsonwebtoken'); // module import
const passport = require('passport');
const models = require('../models');
const cryptfuncs = require('../drivers/cryptfuncs');
const util = require('../drivers/util');
const { nextTick } = require('async');
const upload = require('../routes/thirdparts/fileUpload_s3_aws');
const multer = require('multer');
const { Wallet, Users } = require('../models');

const ethfuncs = require('../drivers/ethdrv');
const users = new ethfuncs('ropsten', 3, '04c4d59194974921b49dc457d728b64e');
const BigNumber = require('bignumber.js');
const tokenCtrl = require('../controllers/token');
const Tx = require('ethereumjs-tx').Transaction;
const initapp = require('../initapp')
const token = new tokenCtrl();

// import cryptfuncs from '../drivers/cryptfuncs';

const crypt = new cryptfuncs();
const Op = models.Sequelize.Op;

class walletfunc {

	// crypt;
	

	constructor() {

		// this.crypt = new cryptfuncs();

	}
	
	/**
	 * 작품등록
	 * @param {*} req 
	 * @param {*} res 
	 */
	async create(req, res) {

		let result = new Object();
		result.code = "OK";

		upload(req, res, function(err) {
		
			if (err instanceof multer.MulterError) {
				console.log(err)
				return next(err);
			} else if (err) {
				console.log(err)
				return next(err);  
			}
			
			try {

				if(req.file){
					console.log('title :'+req.body.title) 
					console.log('원본파일명 : ' + req.file.originalname)
					console.log('저장파일명 : ' + req.file.filename)
					console.log('크기 : ' + req.file.size)
					console.log('description : ' + req.body.description)
					// console.log('경로 : ' + req.file.location) s3 업로드시 업로드 url을 가져옴
					
					let created = models.Nft.create({  
						address: req.body.address,
						file_path: req.file.location.replace('\\','/'), //s3 업로드시 업로드 url을 가져옴
						//file_path: req.file.path,
						category: req.body.category,
						nft_link: req.body.nftLink,
						market_yn: 'N',
						title: req.body.title,
						description: req.body.description
					}).then(function(res){
						console.log(res)
						console.log("OK")
						result.code = "OK";
					}); 
				
				}else{
					result.code = "FAIL";
				}
			
			if(err) {
				result.code = 'FAIL';
				result.message = 'create nft failed';
				result.status = 'creatNftFailed';
			}else{
				result.message = 'OK';
				result.status = 'createNftOK';
			}
			
			}catch(error){
				console.log(error)
			}

			res.json(result)
			res.send();

		});
							
	}
	

		/**
	 * 스왑이력
	 * @param {*} address 
	 * @returns 
	 */
		async getMySwapHistory(address) {

			let result;
	
			try{
				do {			
		
					let query = `SELECT  swap_from
										, swap_to
										, swap_from_amount AS from_amount
										, swap_to_amount AS to_amount
										, createdAt AS swapDate
										, txid
								FROM mega_nft_swap_histories
								WHERE address = '${address}'`;
	
					result = await models.sequelize.query(query, { type: models.Sequelize.QueryTypes.SELECT });
				
				}while(false);
	
			}catch(error){
				console.log(error)
			}
			return result;
		}


}




module.exports = walletfunc;