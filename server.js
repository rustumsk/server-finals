import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import popul from './populate.js';
import pool from './pool.js';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config(); 

const app = express();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    try {
        const result = await pool.query("SELECT * from users");
        res.status(200).json(result.rows);
    } catch (e) {
        res.status(500).send("Internal Server Error!!");
    }
});

app.post('/', async (req, res) => {
    const { user_email, user_password } = req.body;
    console.log("Hello");
    try {
        const result = await pool.query("SELECT * FROM users WHERE user_email = $1 AND user_password = $2", [user_email, user_password]);
        if (result.rows.length > 0) {  
            res.status(200).send("Login Successfully!");
        } else {
            res.status(400).send("Invalid Credentials!"); 
        }
    } catch (e) {
        console.log(e);
        res.status(500).json("Error!");
    }
});

app.post('/signup', async (req, res) => {
    const { user_email, user_password, user_image } = req.body;
    console.log("sup Bro");
    try {
        const img = user_image ? user_image : 'https://res.cloudinary.com/dkjvr8efj/image/upload/v1733383626/uploads/Avatar.png.png';
        await pool.query("INSERT INTO Users(user_email, user_password, user_image) VALUES($1,$2,$3)", [user_email, user_password, img]);
        res.status(200).json("User Inserted!");
    } catch (e) {
        console.log(e);
        res.status(500).json("Duplicated user or something went wrong");
    }
});
app.post('/update', async (req,res) =>{
    const {user_email, new_email, new_password, new_image} = req.body;
    try{
        await pool.query("UPDATE Users SET user_email = $1, user_password = $2, user_image = $3 WHERE user_email = $4", [new_email, new_password, new_image, user_email]);
        res.status(200).json("User Updated!");
    }catch(e){
        console.log(e);
        res.status(500).json("Error udpating the user!");
    }
});

app.post('/upload-image', async (req, res) => {
    const { base64Image } = req.body;

    if (!base64Image) {
        return res.status(400).json({ error: 'No base64 image provided.' });
    }

    try {
        const response = await cloudinary.uploader.upload(base64Image, {
        });
        res.json({ url: response.secure_url });
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        res.status(500).json({ error: 'Failed to upload image to Cloudinary.' });
    }
});
popul();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Listening at PORT: ${PORT}`);
});