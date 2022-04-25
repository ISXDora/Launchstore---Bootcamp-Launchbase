const { Pool } = require("pg")

module.exports = new Pool ({
    user: 'postgres',
    password: 'launchbase',
    host: 'localhost',
    database: 'launchstoredb',
    port: 5432
})