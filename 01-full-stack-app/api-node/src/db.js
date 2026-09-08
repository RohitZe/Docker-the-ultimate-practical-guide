const fs = require('fs');

const { Pool } = require('pg');


console.log('hello this is first line')

databaseUrl =
  process.env.DATABASE_URL ||
  fs.readFileSync(process.env.DATABASE_URL_FILE, 'utf8');


  console.log('this is second line',databaseUrl)

const pool = new Pool({
  connectionString: databaseUrl,
});

// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// async/await - check out a client
const getDateTime = async () => {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT NOW() as now;');
    return res.rows[0];
  } catch (err) {
    console.log(err.stack);
  } finally {
    client.release();
  }
};

module.exports = { getDateTime };
