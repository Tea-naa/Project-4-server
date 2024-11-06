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

// GET route to retrieve all categories from the database
router.get("/", async (req, res) => {   
    try {
        const [data] = await connection.promise().query(`SELECT * FROM categories;`);
        res.status(200).json({ categories: data });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST route to create a new category in the database
router.post("/", async (req, res) => {
    try {
        const { category_name } = req.body;
        await connection.promise().query(
            `INSERT INTO categories (category_name) VALUES (?);`,
            [category_name]
        );
        res.status(201).json({ message: 'Category added successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE route to remove a category by its ID
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await connection.promise().query(
            `DELETE FROM categories WHERE category_id = ?;`, [id]
        );
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Category deleted successfully' });
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
