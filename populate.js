import * as dotenv from 'dotenv';
import pkg from 'pg';  // Use default import for CommonJS module
const { Client } = pkg;  // Destructure to get Client
dotenv.config();

const SQL = `
    CREATE TABLE IF NOT EXISTS users(
        user_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        user_email VARCHAR(255) UNIQUE NOT NULL,
        user_password VARCHAR(255) NOT NULL,
        user_image VARCHAR(255) DEFAULT 'https://res.cloudinary.com/dkjvr8efj/image/upload/v1733383626/uploads/Avatar.png.png'
    );

    INSERT INTO users(user_email, user_password) VALUES('rustum@gmail.com', '123456');
`;

const popul = async () => {
    try {
        const client = new Client({
            connectionString: process.env.DEVCONNECT,
            ssl:{
                rejectUnauthorized: false
            }
        });
        await client.connect();
        console.log("Connected!");
        await client.query(SQL);
        console.log("Done!");
        await client.end();
    } catch (e) {
        console.log(e);
    }
}

export default popul;