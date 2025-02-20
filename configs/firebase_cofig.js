const admin = require("firebase-admin");
const serviceAccount = require("./codico-global-academy-fda6d-firebase-adminsdk-fbsvc-f6cb21b8ac.json"); // Ensure correct path
// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://codico-global-academy-fda6d.firebaseio.com"
});

const auth = admin.auth();
const db = admin.firestore();

module.exports = { auth, db };
