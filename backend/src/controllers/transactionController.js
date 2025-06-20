
import {sql} from "../config/db.js";

export async function getTransactionsByUserId(req,res){
           try {
             const {userId}=req.params;
             console.log(userId);
            const transaction= await sql`
             SELECT * FROM transactions
             WHERE user_id = ${userId}
             ORDER BY created_at DESC
             `
             res.status(200).json(transaction);
           } catch (error) {
               console.error("Error fetching transactions:", error);
               res.status(500).json({ error: "Internal server error" });
           }
}

export async function createTransaction(req, res) {
        try{
            const {title,amount,category,user_id}=req.body;
            if (!title || amount===undefined || !category || !user_id) {
                return res.status(400).json({ error: "All fields are required" });
            }
            const transaction=await sql `
                INSERT INTO transactions (user_id, title, amount, category)
                VALUES (${user_id}, ${title}, ${amount}, ${category})
                RETURNING *`;
    
    
            res.status(201).json(transaction[0]);
        } catch (error) {
             console.error("Error creating transaction:", error);
             res.status(500).json({ error: "Internal server error" });
        }
}

export async function deleteTransaction(req, res) {
        try {
           const {id}= req.params;
    
           if (isNaN(id)) {
               return res.status(400).json({ error: "Invalid transaction ID" });
             }
    
           const result= await sql`
           DELETE FROM transactions
           WHERE id = ${id}
           RETURNING *
           `;
    
           if (result.length === 0) {
               return res.status(404).json({ error: "Transaction not found" });
           }
    
           res.status(200).json({ message: "Transaction deleted successfully", result: result[0] });
    
        } catch (error) {
            console.error("Error deleting transaction:", error);
            res.status(500).json({ error: "Internal server error" });
        }
     }
    
export async function getTransactionSummary(req, res) {
        try {
            const{userId}=req.params;
    
            const balanceResult=await sql `
            SELECT COALESCE(SUM(amount),0) as balance
            FROM transactions
            WHERE user_id = ${userId}
            `;
    
            const incomeResult=await sql `
            SELECT COALESCE(SUM(amount),0) as income 
            FROM transactions
            WHERE user_id = ${userId} AND amount > 0
            `;
    
            const expensesResult=await sql `
            SELECT COALESCE(SUM(amount),0) as income 
            FROM transactions
            WHERE user_id = ${userId} AND amount < 0
            `;
    
            res.status(200).json({
                balance: balanceResult[0].balance,
                income: incomeResult[0].income,
                expenses: expensesResult[0].income
            });
    
        } catch (error) {
        }
}