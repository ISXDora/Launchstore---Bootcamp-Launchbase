const { Pool } = require("pg")

module.exports = new Pool ({
    user: 'launchbase',
    password: 'launchbase',
    host: 'localhost',
    database: 'launchstoredb',
    port: 5432
})