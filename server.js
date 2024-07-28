const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Configurați conexiunea la PostgreSQL
const pool = new Pool({
  user: 'bloguser',
  host: 'localhost',
  database: 'blogdb',
  password: 'parola',
  port: 5432,
});

app.use(bodyParser.json());
app.use(express.static('public'));

// Configurați multer pentru a stoca fișierele încărcate în directorul 'public/uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Rute pentru API
app.get('/api/posts', async (req, res) => {
  const searchQuery = req.query.q;
  let query = 'SELECT * FROM posts ORDER BY created_at DESC';
  let values = [];

  if (searchQuery) {
    query = 'SELECT * FROM posts WHERE title ILIKE $1 OR short_text ILIKE $1 ORDER BY created_at DESC';
    values = [`%${searchQuery}%`];
  }

  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/posts', upload.single('image'), async (req, res) => {
  const { title, shortText, longText } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    const result = await pool.query(
      'INSERT INTO posts (title, short_text, long_text, image_path, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [title, shortText, longText, imagePath]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).json({ error: 'Database error' });
  }
});

// Rute pentru paginile HTML
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/post/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const result = await pool.query('SELECT * FROM posts WHERE id = $1', [postId]);
    if (result.rows.length > 0) {
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${result.rows[0].title}</title>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
          <link rel="stylesheet" href="/styles.css">
        </head>
        <body>
          <nav class="navbar bg-body-tertiary">
            <div class="container-fluid">
              <a class="navbar-brand">Blog</a>
              <form class="d-flex" role="search">
              <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
              <button class="btn btn-outline-success" type="submit">Search</button>
              </form>
            </div>
          </nav>
          <div class="container mt-5">
            <h1>${result.rows[0].title}</h1>
            <img src="${result.rows[0].image_path}" class="img-fluid" alt="${result.rows[0].title}">
            <div class="blog-long-text"><p id="long-text">${result.rows[0].long_text}</p></div>
          </div>
        </body>
        </html>
      `);
    } else {
      res.status(404).send('Post not found');
    }
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
