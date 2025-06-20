import express from 'express';
import { deleteTransaction,createTransaction, getTransactionsByUserId, getTransactionSummary } from '../controllers/transactionController.js'; // Adjust the path as necessary

const router=express.Router();


router.get("/summary/:userId",getTransactionSummary);

router.get("/:userId", getTransactionsByUserId);

router.delete("/:id",deleteTransaction);

router.post("/",createTransaction);


export default router;
