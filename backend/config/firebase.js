const admin = require("firebase-admin");
require("dotenv").config();

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

const initFirebase = () => {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log("Firebase успішно підключено");
    return admin.firestore();
  } catch (error) {
    console.error(`Помилка при підключенні до Firebase: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { initFirebase, admin };
