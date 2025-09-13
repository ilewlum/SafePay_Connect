import express from "express";
import admin from "firebase-admin";
import { v4 as uuidv4 } from "uuid";

// #region Load environment variables
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;
const privateKey = "fhf7fjJjdhfjvnG1123"
// #endregion

// #regionInitialize Firestore with service account
admin.initializeApp({
  credential: admin.credential.cert("src/Backend_api/safepay-connect-firebase-adminsdk-fbsvc-8175ce9093.json"),
});

const db = admin.firestore();
// #endregion
// #region Routes
// #region User routes
app.get("/", (req, res) => {
  res.send("Express + Firestore API running 🚀");
});

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

app.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;
    // retrieves the user corresponding to the email
    const userQuery = await db.collection("users").where("email", "==", email).get();
    if (userQuery.empty) {
      return res.status(404).json({ message: "User not found" });
    }

    // retrieves the userID from that user
    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();
    const userId = userDoc.id;
    const keyDoc = await db.collection("keys").doc(userId).get();
    if (!keyDoc.exists) {
      return res.status(500).json({ message: "Security info missing" });
    }

    // finds the password and checks if the password matched the password in the database
    const { password: hashedPassword } = keyDoc.data();
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // generates and updates the AUthToken after every login
    const token = authTokenGenerator(userId, userData.name, userData.surname);
    await db.collection("keys").doc(userId).update({authToken: token});
    res.status(200).json({
      userId,
      username:userData.username,
      name: userData.name,
      surname: userData.surname,
      email: userData.email,
      token
    });
    console.log("User: ", userId, " Has logged In");

  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
// #endregion

// #endregion

// Start the server

app.listen(port, () => {
  console.log(`Server is running on port  http://localhost:${port}`);
});
