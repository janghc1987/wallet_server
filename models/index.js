const path = require('path'); 
const Sequelize = require('sequelize'); 

const config = require(path.join(__dirname, '..', 'config', 'config.json'))[global.env.NODE_ENV];

const db = {}; 
const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize; 
db.Sequelize = Sequelize; 

db.Users = require('./users')(sequelize, Sequelize); 
db.Accounts = require('./accounts')(sequelize, Sequelize); 
db.Assets = require('./assets')(sequelize, Sequelize); 
db.Config = require('./config')(sequelize, Sequelize); 
db.Exchanges = require('./exchanges')(sequelize, Sequelize); 
db.Login = require('./login')(sequelize, Sequelize); 
db.Transactions = require('./transactions')(sequelize, Sequelize); 
db.Transactions_internal = require('./transactions_internal')(sequelize, Sequelize); 
db.Wallet = require('./wallet')(sequelize, Sequelize); 


db.Users.hasMany(db.Accounts, { foreignKey: 'user_id', sourceKey: 'id' });
db.Accounts.belongsTo(db.Users, { foreignKey: 'user_id', targetKey: 'id' });

db.Users.hasMany(db.Exchanges, { foreignKey: 'user_id', sourceKey: 'id' });
db.Exchanges.belongsTo(db.Users, { foreignKey: 'user_id', targetKey: 'id' });

db.Users.hasMany(db.Login, { foreignKey: 'user_id', sourceKey: 'id' });
db.Login.belongsTo(db.Users, { foreignKey: 'user_id', targetKey: 'id' });

db.Assets.hasMany(db.Transactions, { foreignKey: 'asset_id', sourceKey: 'id' });
db.Transactions.belongsTo(db.Assets, { foreignKey: 'asset_id', targetKey: 'id' });

db.Assets.hasMany(db.Transactions, { foreignKey: 'asset_id', sourceKey: 'id' });
db.Transactions_internal.belongsTo(db.Assets, { foreignKey: 'asset_id', targetKey: 'id' });

db.Assets.hasMany(db.Accounts, { foreignKey: 'asset_id', sourceKey: 'id' });
db.Accounts.belongsTo(db.Assets, { foreignKey: 'asset_id', targetKey: 'id' });

// db.assets = db.Assets.findAll();
 
module.exports = db;

