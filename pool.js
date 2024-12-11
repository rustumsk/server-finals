import pkg from 'pg'; 
const { Pool } = pkg; 
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DEVCONNECT,
    ssl: {
      rejectUnauthorized: false 
    }
  });

export default pool;