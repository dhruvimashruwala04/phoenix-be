const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log("Connected to database");
    client.release();
  } catch (error) {
    console.log("Error connecting to database: ", error.message);
    process.exit(1);
  }
};

pool.on("error", (error) => {
  console.log("Unexpected database error: ", error.message);
});

module.exports = { connectDB, pool };
