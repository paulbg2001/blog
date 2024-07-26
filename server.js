const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Configurați conexiunea la PostgreSQL
const pool = new Pool({
  user: 'postgres', // Înlocuiți cu utilizatorul PostgreSQL
  host: 'localhost',
  database: 'blogdb', // Înlocuiți cu numele bazei de date
  password: '1234', // Înlocuiți cu parola PostgreSQL
  port: 5432,
});

app.use(bodyParser.json());
app.use(express.static('public'));

// Rute pentru API
app.get('/api/posts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM posts');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/posts', async (req, res) => {
  const { title, content } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING *',
      [title, content]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
