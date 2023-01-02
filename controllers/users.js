
const jwt = require('jsonwebtoken'); // module import
const passport = require('passport');
const models = require('../models');
const cryptfuncs = require('../drivers/cryptfuncs');
const util = require('../drivers/util');
const { nextTick } = require('async');
const upload = require('../routes/thirdparts/fileUpload_s3_aws');
const multer = require('multer');
const { Wallet , Users } = require('../models');
const ethfuncs = require('../drivers/ethdrv');
const admin = new ethfuncs('mainnet', 1, global.env.INFURA_ADMIN_KEY);
const BigNumber = require('bignumber.js');
const etherscan = require('../drivers/etherscan');
const BN = require('bn.js');

// import cryptfuncs from '../drivers/cryptfuncs';

const crypt = new cryptfuncs();

class usersfunc {
	
	async chgMyImg(req, res) {

		
		let result = new Object();
		result.code = "OK"

		upload(req, res, function(err) {
		
			if (err instanceof multer.MulterError) {
				return next(err);
			} else if (err) {
				return next(err);  
			}

			try{
				if(req.file){
					let query = `INSERT INTO mega_nft_users(
						ADDRESS,
						FILE_PATH,
						NICK_NAME,
						MGP_AMOUNT,
						MEGA_AMOUNT,
						CREATEDAT,
						UPDATEDAT
					)
					VALUES(
						'${req.body.address}',
						'${req.file.location.replace('\\','/')}',
						NULL,
						'0',
						'0',
						NOW(),
						NOW()
					)
					ON DUPLICATE KEY UPDATE 
					file_path = '${req.file.location.replace('\\','/')}'`;
		
					models.sequelize.query(query, { type: models.Sequelize.QueryTypes.UPDATE }).then(function(fileRes){
						result.code = "OK";
					});
					
					result.code = "OK";
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

	async chgMyNickName(req, res) {

		let result = new Object();
		result.result = new Object();

		try{

				let query = `INSERT INTO mega_nft_users(
					ADDRESS,
					NICK_NAME,
					MGP_AMOUNT,
					CREATEDAT,
					UPDATEDAT
				)
				VALUES(
					'${req.body.address}',
					'${req.body.nickName}',
					'0',
					NOW(),
					NOW()
				)
				ON DUPLICATE KEY UPDATE 
				nick_name = '${req.body.nickName}'`;

				models.sequelize.query(query, { type: models.Sequelize.QueryTypes.UPDATE }).then(function(fileRes){
					result.result.code = 200;
				});
				result.result.code = 200;

		}catch(e){
			console.log(e);
		}

		res.send(result);	
							
	}


	async myUserInfo(address) {

		let result ;
		let tvsBalance = null;
		let ethBalance = null;
		let polygonBalance = null;
		let mega_amount = '0';
		let eth_amount = '0';
		let polygon_amount = '0';

		try{
			do {			

				if(address != undefined){
					// let token = await admin.getContract('MEGA');
					// tvsBalance = await admin.getTokenBalance(address, token.contract);
					
					process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

					let tvsurl = etherscan.getTokenOpt(address, global.env.ETHERSCAN_APIKEY,'0x112717662a9C7a3ab54684657Dfd6DFaac83c04D');
					let resultTvs  = JSON.parse(await util.requestHttps(tvsurl));
					tvsBalance = resultTvs.result;
					console.log("megaBalance",tvsBalance)

					let ethurl = etherscan.getEtherOpt(address, global.env.ETHERSCAN_APIKEY);
					let resultEth  = JSON.parse(await util.requestHttps(ethurl));
					ethBalance = resultEth.result;
					console.log('ethBalance : '+ethBalance)
					//ethBalance = new BN(resultEth.result);

					let polygonurl = etherscan.getPolygonOpt(address, global.env.POLYGONSCAN_APIKEY);
					let resultPolygon  = JSON.parse(await util.requestHttps(polygonurl));
					polygonBalance = resultPolygon.result;

					if(tvsBalance != null){
						mega_amount = new BigNumber(tvsBalance).div(new BigNumber(10).pow(18)).toNumber();
					}
					if(ethBalance != null){
						eth_amount = new BigNumber(ethBalance).div(new BigNumber(10).pow(18)).toNumber();
					}
					if(polygonBalance != null){
						polygon_amount = new BigNumber(polygonBalance).div(new BigNumber(10).pow(18)).toNumber();
					}
				}


				let query = `SELECT  address
									,file_path
									,nick_name
									,mgp_amount
									,${mega_amount} AS mega_amount 
									,${eth_amount} AS eth_amount 
									,${polygon_amount} AS polygon_amount 
							FROM mega_nft_users 
							WHERE address = '${address}'`;

				result = await models.sequelize.query(query, { type: models.Sequelize.QueryTypes.SELECT });

				if(result.length == 0){
					let query2 = `SELECT '${address}' AS address
									,'' AS file_path
									,'' AS nick_name
									,0 AS mgp_amount
									,${mega_amount} AS mega_amount 
									,${eth_amount} AS eth_amount 
									,${polygon_amount} AS polygon_amount `;

					result = await models.sequelize.query(query2, { type: models.Sequelize.QueryTypes.SELECT });
				}

			
			}while(false);

		}catch(error){
			console.log(error)
		}
		return result;
	}

	async mySwapHistory(address) {

		let result;

		try{
			do {			

				let query = `SELECT  id
									,address
									,blockNumber
									,eth_amount
									,mgp_amount
									,mega_amount
									,polygon_amount
									,createdAt 
									,updatedAt
							FROM mega_nft_swap_histories
							AND address = '${address}'`;

				result = await models.sequelize.query(query, { type: models.Sequelize.QueryTypes.SELECT });
			
			}while(false);
		}catch(error){
			console.log(error)
		}

		return result;
	}


}




module.exports = usersfunc;