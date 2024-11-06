import express from 'express';
import mysql from 'mysql2';

const router = express.Router();

// Connecting to the database
const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "mydb"
});

// GET route to retrieve all questions
router.get("/", async (req, res) => {   
    try {
        const [data] = await connection.promise().query(`SELECT * FROM questions;`);
        res.status(200).json({ questions: data });  // Send the questions data as the response
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST route to add a new question
router.post("/", async (req, res) => {
    try {
        const { question_text, answer, category_id } = req.body;
        await connection.promise().query( // Insert the new question into the database
            `INSERT INTO questions (question_text, answer, category_id) VALUES (?, ?, ?)`,
            [question_text, answer, category_id]
        );
        res.status(201).json({ message: 'Question added successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET route to retrieve questions by category ID
router.get("/by-category", async (req, res) => {
    try {
        const { categoryId } = req.query;   // Extract the category ID from the query parameters
        const [data] = await connection.promise().query(  
            `SELECT * FROM questions WHERE category_id = ?;`, [categoryId] //get questions filtered by category ID
        );
        res.status(200).json({ questions: data });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE route to remove a question by ID
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await connection.promise().query(
            `DELETE FROM questions WHERE question_id = ?;`, [id]
        );
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Question deleted successfully' });
        } else {
            res.status(404).json({ message: 'Question not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT route to update a question by ID 
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { question_text, answer, category_id } = req.body;   // Extract updated question data from the request body
        const [result] = await connection.promise().query(         // Query the database to update the question with the provided ID
            `UPDATE questions SET question_text=?, answer=?, category_id=? WHERE question_id=?;`,
            [question_text, answer, category_id, id]
        );
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Question updated successfully' });
        } else {
            res.status(404).json({ message: 'Question not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH route to update a question by ID (partial update)
router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { question_text, answer, category_id } = req.body;

        if (question_text) {   // If question_text is provided, update it in the database
            await connection.promise().query(
                `UPDATE questions SET question_text=? WHERE question_id=?;`,
                [question_text, id]
            );
        } 
        if (answer) {
            await connection.promise().query(
                `UPDATE questions SET answer=? WHERE question_id=?;`,
                [answer, id]
            );
        }
        if (category_id) {
            await connection.promise().query(
                `UPDATE questions SET category_id=? WHERE question_id=?;`,
                [category_id, id]
            );
        }
        res.status(200).json({ message: 'Question updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
