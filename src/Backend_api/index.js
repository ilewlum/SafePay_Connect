import express from "express";
import dotenv from "dotenv";
import admin from "firebase-admin";
import { v4 as uuidv4 } from "uuid";


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
// #region User routes
app.post("/register", async (req, res) => {
    try {
        const { name, surname, username, phoneNumber, password, email } = req.body;
        //  Check if email already exists
        const userQuery = await db.collection("users").where("username", "==", username).get();
        if (!userQuery.empty) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user document
        const userId = uuidv4();
        await db.collection("users").doc(userId).set({
        userId, // optional, since it's also the doc ID
        name,
        surname,
        username,
        phoneNumber,
        email
        });

        // Generate auth token
        const token = authTokenGenerator(userId, name, surname);

        // Store security info separately
        await db.collection("keys").doc(userId).set({
        userId,
        password: hashedPassword, // hashed password
        authToken: token
        });

        // Send response to client
        res.status(201).json("User has been registered");
        console.log("User: ", userId, " Has Registered");

    } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {});
// #endregion

// #endregion

// Start the server

app.listen(port, () => {
  console.log(`Server is running on port  http://localhost:${port}`);
});
