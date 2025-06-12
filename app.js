const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Set up database connection
const db = mysql.createPool({
  host: 'nozomi.proxy.rlwy.net',
  port: 50023,
  user: 'root',
  password: 'HmBOsrPgoAretVqTHOTLDHnsrYrSzJMR',
  database: 'railway'
});

// ------------------------
// Reset & Delete Test Data
// ------------------------
app.get('/reset-db', async (req, res) => {
  try {
    await db.query('CALL sp_reset_schema();');
    res.send('Database reset.');
  } catch (err) {
    console.error('Reset error:', err);
    res.status(500).send('Reset failed.');
  }
});

app.get('/delete-test', async (req, res) => {
  try {
    await db.query('CALL DeleteTestStudent();');
    res.send('Test student removed.');
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).send('Delete failed.');
  }
});

// ------------------------
// SELECT Routes
// ------------------------
app.get('/students', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Students;');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading students.');
  }
});

app.get('/events', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Events;');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading events.');
  }
});

app.get('/locations', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Locations;');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading locations.');
  }
});

app.get('/organizations', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Organizations;');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading organizations.');
  }
});

app.get('/registrations', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Registrations;');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading registrations.');
  }
});

// ------------------------
// Registrations: Add, Update, Delete
// ------------------------
app.post('/add-registration', async (req, res) => {
  const { studentID, eventID, timestamp } = req.body;
  try {
    await db.query(
      'INSERT INTO Registrations (studentID, eventID, timestamp) VALUES (?, ?, ?)',
      [studentID, eventID, timestamp]
    );
    res.send('Registration added.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Add failed.');
  }
});

app.put('/update-registration', async (req, res) => {
  const { registrationID, studentID, eventID } = req.body;
  try {
    await db.query('CALL sp_update_registration(?, ?, ?)', [
      registrationID,
      studentID,
      eventID
    ]);
    res.send('Registration updated.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Update failed.');
  }
});

app.delete('/delete-registration/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM Registrations WHERE registrationID = ?', [req.params.id]);
    res.send('Registration deleted.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Delete failed.');
  }
});

// ------------------------
// Students: Add, Delete
// ------------------------
app.post('/add-student', async (req, res) => {
  const { firstName, lastName, email } = req.body;
  try {
    await db.query(
      'INSERT INTO Students (firstName, lastName, email) VALUES (?, ?, ?)',
      [firstName, lastName, email]
    );
    res.send('Student added.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Add failed.');
  }
});

app.delete('/delete-student/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM Students WHERE studentID = ?', [req.params.id]);
    res.send('Student deleted.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Delete failed.');
  }
});

// ------------------------
// Events: Add, Delete
// ------------------------
app.post('/add-event', async (req, res) => {
  const { title, eventDate, locationID, hostOrgID } = req.body;
  try {
    await db.query(
      'INSERT INTO Events (title, eventDate, locationID, hostOrgID) VALUES (?, ?, ?, ?)',
      [title, eventDate, locationID, hostOrgID]
    );
    res.send('Event added.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Add failed.');
  }
});

app.delete('/delete-event/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM Events WHERE eventID = ?', [req.params.id]);
    res.send('Event deleted.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Delete failed.');
  }
});

// ------------------------
// Orgs: Add, Delete
// ------------------------
app.post('/add-organization', async (req, res) => {
  try {
    await db.query('INSERT INTO Organizations (orgName, presidentEmail) VALUES (?, ?)', [req.body.orgName, req.body.presidentEmail]);
    res.send('Organization added.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Add failed.');
  }
});

app.delete('/delete-organization/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM Organizations WHERE orgID = ?', [req.params.id]);
    res.send('Organization deleted.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Delete failed.');
  }
});

// ------------------------
// Locations: Add, Delete
// ------------------------
app.post('/add-location', async (req, res) => {
  try {
    await db.query('INSERT INTO Locations (locationName) VALUES (?)', [req.body.locationName]);
    res.send('Location added.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Add failed.');
  }
});

app.delete('/delete-location/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM Locations WHERE locationID = ?', [req.params.id]);
    res.send('Location deleted.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Delete failed.');
  }
});

// ------------------------
// Start Server
// ------------------------
// ------------------------
// Start Server
// ------------------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server up at http://localhost:${PORT}`);
});
