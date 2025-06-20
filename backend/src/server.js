//const express=require("express")
import express from "express";
import dotenv from "dotenv";
import {sql} from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoutes.js";

dotenv.config();

const app=express();
const PORT=process.env.PORT;

app.use(rateLimiter);
app.use(express.json());

app.use((req, res, next) => {
    console.log("Hey we hit a req, the method is:", req.method);
    next();
})

async function initDB() {
    try {
      await sql`CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
      )`; 
        console.log("Database initialized successfully.");
    } catch (error) {
        console.error("Error initializing database:", error);
        process.exit(1);
    } 
}

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});

app.use("/api/transactions",transactionsRoute)
