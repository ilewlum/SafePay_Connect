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

// #region Wallet routes
app.post("/createWallet", authenticateToken, async (req, res) => {
    try {
      const {provider,type, walletNumber} = req.body;
      const userID = req.user.userID;
      await db.collection("wallet").doc(uuidv4()).set({
            userID : userID,
            provider: provider,
            type: type,
            walletNumber: walletNumber,
            history: []      
        })

        res.status(201).json({
            message: "Wallet successfully created"
        });
    } 
    catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/viewWallet", authenticateToken, async (req, res) => {
  try {
    //find the wallet for that user
    const userID = req.user.userID;
    const walletQuery = await db.collection("wallet").where("userID", "==", userID).get();
    //check if wallet exists
    if (walletQuery.empty) {
      return res.status(404).send("Wallet not found");
    }
    
    const walletDoc = walletQuery.docs[0];
    const walletData = walletDoc.data();

    // Resolve transactions from history
    const transactions = await Promise.all(
      (walletData.history || []).map(async (txId) => {
        const txDoc = await db.collection("transaction").doc(txId).get();
        return txDoc.exists ? { id: txDoc.id, ...txDoc.data() } : null;
      })
    );
    //Return wallet information
    res.status(200).json({
      provider: walletData.provider,
      walletNumber: walletData.walletNumber,
      transactions
    });

  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.patch("/updateWallet", authenticateToken, async (req, res) => {
  try {
    const { provider, type, walletNumber } = req.body;
    const userID = req.user.userID;
    const walletQuery = await db.collection("wallet").where("userID", "==", userID).get();
    if (walletQuery.empty) {
      return res.status(404).json({ message: "Wallet not found" });
    }
    const walletDoc = walletQuery.docs[0];
    await db.collection("wallet").doc(walletDoc.id).update({
      provider: provider || walletDoc.data().provider,
      type: type || walletDoc.data().type,
      walletNumber: walletNumber || walletDoc.data().walletNumber
    });
    const updatedWallet = await db.collection("wallet").doc(walletDoc.id).get();
    res.status(200).json({ message: "Wallet updated successfully", wallet: updatedWallet.data() });
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
  
});
// #endregion

// #region Transaction routes

// #endregion

// #region Message routes

// #endregion

// #endregion

// Start the server

app.listen(port, () => {
  console.log(`Server is running on port  http://localhost:${port}`);
});
