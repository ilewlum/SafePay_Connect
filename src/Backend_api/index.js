import express from "express";
import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config();
//#region initialise and setup
const app = express();
const port = process.env.PORT || 3000;

admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  ),
});
//#endregion
// #region Routes


// #endregion

// Start the server

app.listen(port, () => {
  console.log(`Server is running on port  http://localhost:${port}`);
});
