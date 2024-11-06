import express from 'express';
import mysql from 'mysql2';
import cors from 'cors'; 
import questions from './routers/questions.js';
import categories from './routers/categories.js'; 
import users from './routers/users.js';

const app = express();
app.use(express.json());
app.use(cors());  
app.use('/questions', questions); 
app.use('/categories', categories); 
app.use('/users', users);

// Connecting to the database
const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "mydb"
});

// Home route
app.get('/', (req, res) => {
    res.send('Project 4 - Killer Knowledge App');
});

// Start the server
app.listen(3003, () => {
    console.log('Listening on port 3003');
});
