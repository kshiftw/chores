// Import firebase-admin package, initialize firebase database object, and export it for other modules to use
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();

module.exports = { admin, db };
