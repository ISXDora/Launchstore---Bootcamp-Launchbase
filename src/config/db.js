const { Pool } = require("pg")

module.exports = new Pool ({
    user: 'postgres',
    password: '123456',
    host: 'localhost',
    database: 'launchstoredb',
    port: 5433
})