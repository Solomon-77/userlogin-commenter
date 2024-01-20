const { Pool } = require('pg');

const pool = new Pool({
    connectionString: 'postgres://user_db_zwco_user:mU2pxzNJGYFxfB7qyDOiiUBlq9qfDsj1@dpg-cmlmh6v109ks7393emm0-a.singapore-postgres.render.com/user_db_zwco',
    ssl: {
        rejectUnauthorized: false,
    },
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

module.exports = pool;