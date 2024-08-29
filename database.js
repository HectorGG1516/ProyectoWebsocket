const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE messages (content TEXT)");

    db.run("INSERT INTO messages(content) VALUES (?)", ['Mensaje inicial']);
});

module.exports = db;
