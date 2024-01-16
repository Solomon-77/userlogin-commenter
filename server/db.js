const { Pool } = require('pg');

const pool = new Pool({
    connectionString: 'postgres://userlogin_commenter_server_user:RcLXfXL3OzUQ5RUmRvJwGvGzPya4GRoP@dpg-cmj75la1hbls738hin60-a.singapore-postgres.render.com/userdb',
    ssl: {
        rejectUnauthorized: false,
    },
});

module.exports = pool;