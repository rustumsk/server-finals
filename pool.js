import pkg from 'pg';  // Use default import for CommonJS module
const { Pool } = pkg;  // Destructure to get Client
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false 
    }
  });

export default pool;