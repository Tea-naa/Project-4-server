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

// POST route to register a new user
router.post("/register", async (req, res) => {
    try {
        const { uname, pword } = req.body; // Extracting the username (uname) and password (pword) from the request body

        // Check if username already exists
        const [existingUser] = await connection.promise().query(
            "SELECT * FROM users WHERE uname = ?", [uname]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Inserting the new user into the "users" table
        const [data] = await connection.promise().query(
            "INSERT INTO users (uname, pword) VALUES (?, ?)", [uname, pword]
        );

        res.status(201).json({ message: 'User registered successfully', user: { uname } });
    } catch (err) {
        res.status(500).json({ message: 'Database error' });
    }
});


// GET route to retrieve all users
router.get("/", async (req, res) => {
    try {
        const [data] = await connection.promise().query(`SELECT * FROM users;`);// Query to get all users from the database
        res.status(200).json({ users: data });   // Return the list of users in the response
    } catch (err) {
        console.error(err); 
        res.status(500).json({ message: err.message });
    }
});



// POST route to log in a user
router.post("/login", async (req, res) => {
    const { uname, pword } = req.body;

    try {     
        const [rows] = await connection.promise().query( // Query to check if the username exists in the database
            "SELECT * FROM users WHERE uname = ?", [uname]
        );

        if (rows.length === 0) {  
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = rows[0];   // Extract the user data from the query result
        if (user.pword !== pword) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

       
        res.status(200).json({ message: 'Login successful', user: { uname: user.uname } });
    } catch (err) {
        res.status(500).json({ message: 'Database error' });
    }
});

export default router;
