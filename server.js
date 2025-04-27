const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = new sqlite3.Database('./train_history.db');

app.post('/search-historical-trip', (req, res) => {
  const { startStationCode, endStationCode, date } = req.body;

  const query = `
    SELECT a.train_number, a.actual_departure_time, a.delay_comment, b.actual_arrival_time, b.delay_comment
    FROM train_history a
    JOIN train_history b
    ON a.train_number = b.train_number
    WHERE a.station_code = ?
    AND b.station_code = ?
    AND a.date = ?
    AND b.date = ?
  `;

  db.all(query, [startStationCode, endStationCode, date, date], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Database error.");
    }
    res.json(rows);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚂 TrainTrack server running on port ${PORT}`);
});
