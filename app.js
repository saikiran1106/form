const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3001;

// Set up SQLite database
const db = new sqlite3.Database('database.db');

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS forms (name TEXT, email TEXT, mobile TEXT, location TEXT, amount INTEGER)');
});

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
  res.render('form');
});

app.get("/dashboard", (req, res) => {
  const query = `SELECT * FROM forms`;

  db.all(query, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }

    res.render("dashboard", { data: rows });
  });
});

app.post('/submit', (req, res) => {
  const { name, email, mobile, location, amount } = req.body;

  // Insert data into SQLite database
  db.run('INSERT INTO forms (name, email, mobile, location, amount) VALUES (?, ?, ?, ?, ?)', [name, email, mobile, location, amount], (err) => {
    if (err) {
      console.error(err);
      res.redirect('/');
    } else {
      res.redirect('/success');
      console.log('data inserted successfully')
    }
  });
});

app.get('/success', (req, res) => {
  res.sendFile(__dirname + '/success.html');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
