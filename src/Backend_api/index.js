import express from "express";
import admin from "firebase-admin";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors";
import dotenv from "dotenv";


// #region Load environment variables
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;
const privateKey = process.env.JWT_SECRET || "fhf7fjJjdhfjvnG1123"
// #endregion

// #regionInitialize Firestore with service account
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "safepay-connect-firebase-adminsdk-fbsvc-8175ce9093.json";
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
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
app.post("/createTransaction", authenticateToken, async (req, res) => {
    try {
        const {username,amount , reference } = req.body;
        const senderID = req.user.userID;
        const reciever = await db.collection("users").where("username", "==", username).get();;
        if(reciever.empty){
            return res.status(400).json({ message: 'Invalid User' });
        }
        const recieverID = reciever.docs[0].id;

        // get sender and reciever wallets
        const senderWallet = await db.collection("wallet").where("userID", "==", senderID).get();
        if (senderWallet.empty) {
          return res.status(400).json({ message: 'Sender has no wallet' });
        }
        const SenderWalletID = senderWallet.docs[0].id;

        const recipientWallet = await db.collection("wallet").where("userID", "==", recieverID).get();
        if (recipientWallet.empty) {
          return res.status(400).json({ message: 'Recipient has no wallet' });
        }
        const recipientWalletID = recipientWallet.docs[0].id;

        const transactionID = uuidv4();
        await db.collection("transaction").doc(transactionID).set({
            senderID: senderID,
            recieverID: recieverID,
            type: senderWallet.docs[0].data().type,
            walletNumber: senderWallet.docs[0].data().walletNumber,
            amount : amount,
            reference,
            timestamp: new Date().toISOString(),
            status: "pending",
        })
        await db.collection("wallet").doc(SenderWalletID).update({
          history: admin.firestore.FieldValue.arrayUnion(transactionID)
        });
        await db.collection("wallet").doc(recipientWalletID).update({
          history: admin.firestore.FieldValue.arrayUnion(transactionID)
        });

        res.status(201).json({
            message: "Transaction Created",
            status: "pending",
        });    
    } 
    catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/getTransaction/:id", authenticateToken, async (req, res) => {
  try {
    const transactionID = req.params.id;

    // Fetch the transaction document
    const transactionDoc = await db.collection("transaction").doc(transactionID).get();

    if (!transactionDoc.exists) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const transactionData = transactionDoc.data();
    // Return transaction details
    res.status(200).json({
      id: transactionDoc.id,
      senderID: transactionData.senderID,
      recieverID: transactionData.recieverID,
      amount: transactionData.amount,
      type: transactionData.type,
      walletNumber: transactionData.walletNumber,
      reference: transactionData.reference,
      status: transactionData.status,
      timestamp: transactionData.timestamp
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/updateTransaction/:id", authenticateToken, async (req, res) => {
  try {
    const transactionID = req.params.id;
    const {status } = req.body;

    // Fetch the transaction
    const transactionDoc = await db.collection("transaction").doc(transactionID).get();

    if (!transactionDoc.exists) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const transactionData = transactionDoc.data();
    if (transactionData.recieverID !== req.user.userID) {
      return res.status(403).json({ message: "Only the receiver can update the status" });
    }

    // Update the status
    await db.collection("transaction").doc(transactionID).update({
      status: status,
      updatedAt: new Date().toISOString() // optional timestamp
    });

    res.status(200).json({
      message: "Transaction status updated",
      transactionID: transactionID,
      newStatus: status
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// #endregion

// #region Message routes
app.get("/getMessages", authenticateToken, async (req, res) => {
  try {
    const userID = req.user.userID;
    // Corrected Firestore query
    const messageQuery = await db.collection("message").where("userID", "==", userID).get();
    if (messageQuery.empty) {
      return res.status(404).json({ message: "No messages from user" });
    }

    // Extract messages
    const messages = messageQuery.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Return JSON
    res.status(200).json({ messages });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// #endregion

// #region AI endpoint
app.post("/Analyze", authenticateToken, async (req, res) => {
    try {
        const {message} = req.body;
        const userID = req.user.userID;
        const response = await fetch('http://localhost:8080/api/ai-scam/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message })
        });
        
        const data = await response.json();
        await db.collection("message").doc(uuidv4()).set({
          userID,
          isScam : data.isScam,
          confidence: data.confidence,
          riskLevel: data.riskLevel,
          detectedPatterns: data.detectedPatterns,
          recommendation: data.recommendation,
          analysisType: data.analysisType
        })

        res.status(201).json(data);   
    } 
    catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//#endregion

// #region Helper Functions
function authTokenGenerator(id, name, surname){
    const payload = {
        userID : id,
        name : name,
        surname: surname
    };

    const authToken = jwt.sign(payload, privateKey, {expiresIn: '24h'});
    return authToken;
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // expects: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Access denied. Token missing." });
  }

  jwt.verify(token, privateKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }
    req.user = user; // attach user info to request
    next();
  });
}
//#endregion


// Start the server

app.listen(port, () => {
  console.log(`Server is running on port  http://localhost:${port}`);
});
