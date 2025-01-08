const promise = require('bluebird');
const options = {
    promiseLib: promise,
    query: (e) => {}
}

const pgp = require('pg-promise')(options);
const types = pgp.pg.types;
types.setTypeParser(1114, function(stringValue){
    return stringValue;
});

/*const databaseConfig = {
    'host': '127.0.0.1',
    'port': 5432,
    'database': 'delivery_db',
    'user':  'postgres',
    'password': 'root'
};*/
const databaseConfig = {
    'host': 'c1i13pt05ja4ag.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com',
    'port': 5432,
    'database': 'd62n6gn7ffs77m',
    'user':  'u9dr47k19qn138',
    'password': 'p9fba786deb2f1149722e08d2be97fb643981e0bdaac9b95e1b35d9f5a94db5b3',
    'ssl': { rejectUnauthorized: false }
    
};

const db = pgp(databaseConfig);

module.exports = db;