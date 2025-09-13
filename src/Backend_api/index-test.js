import express from "express";
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
const privateKey = process.env.JWT_SECRET || "fhf7fjJjdhfjvnG1123";
// #endregion

// #region In-memory database for testing
const db = {
  users: new Map(),
  keys: new Map(),
  wallets: new Map(),
  transactions: new Map()
};
// #endregion

// #region Routes

// #region User routes
app.get("/", (req, res) => {
  res.send("Express + Test API running 🚀");
});

app.post("/register", async (req, res) => {
  try {
    const { name, surname, username, phoneNumber, password, email } = req.body;

    // Check if user already exists
    const existingUser = Array.from(db.users.values()).find(u => u.username === username || u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const userId = uuidv4();
    db.users.set(userId, {
      userId,
      name,
      surname,
      username,
      phoneNumber,
      email
    });

    // Generate auth token
    const token = authTokenGenerator(userId, name, surname);

    // Store security info
    db.keys.set(userId, {
      userId,
      password: hashedPassword,
      authToken: token
    });

    // Send response to client
    res.status(201).json({ message: "User has been registered", userId });
    console.log("User: ", userId, " Has Registered");

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = Array.from(db.users.values()).find(u => u.email === email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get security info
    const keyData = db.keys.get(user.userId);
    if (!keyData) {
      return res.status(500).json({ message: "Security info missing" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, keyData.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate new token
    const token = authTokenGenerator(user.userId, user.name, user.surname);
    keyData.authToken = token;
    db.keys.set(user.userId, keyData);

    res.status(200).json({
      userId: user.userId,
      username: user.username,
      name: user.name,
      surname: user.surname,
      email: user.email,
      token
    });
    console.log("User: ", user.userId, " Has logged In");

  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
// #endregion

// #region Wallet routes
app.post("/createWallet", authenticateToken, async (req, res) => {
  try {
    const { provider, type, walletNumber } = req.body;
    const userID = req.user.userID;

    const walletId = uuidv4();
    db.wallets.set(walletId, {
      walletId,
      userID,
      provider,
      type,
      walletNumber,
      history: []
    });

    res.status(201).json({
      message: "Wallet successfully created",
      walletId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/viewWallet", authenticateToken, async (req, res) => {
  try {
    const userID = req.user.userID;
    const wallet = Array.from(db.wallets.values()).find(w => w.userID === userID);

    if (!wallet) {
      return res.status(404).send("Wallet not found");
    }

    // Resolve transactions from history
    const transactions = wallet.history.map(txId => db.transactions.get(txId)).filter(Boolean);

    res.status(200).json({
      provider: wallet.provider,
      walletNumber: wallet.walletNumber,
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

    const wallet = Array.from(db.wallets.values()).find(w => w.userID === userID);
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    // Update wallet
    wallet.provider = provider || wallet.provider;
    wallet.type = type || wallet.type;
    wallet.walletNumber = walletNumber || wallet.walletNumber;
    db.wallets.set(wallet.walletId, wallet);

    res.status(200).json({ message: "Wallet updated successfully", wallet });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// #endregion

// #region Transaction routes
app.post("/createTransaction", authenticateToken, async (req, res) => {
  try {
    const { username, amount, reference } = req.body;
    const senderID = req.user.userID;

    // Find receiver
    const receiver = Array.from(db.users.values()).find(u => u.username === username);
    if (!receiver) {
      return res.status(400).json({ message: 'Invalid User' });
    }

    // Get wallets
    const senderWallet = Array.from(db.wallets.values()).find(w => w.userID === senderID);
    if (!senderWallet) {
      return res.status(400).json({ message: 'Sender has no wallet' });
    }

    const recipientWallet = Array.from(db.wallets.values()).find(w => w.userID === receiver.userId);
    if (!recipientWallet) {
      return res.status(400).json({ message: 'Recipient has no wallet' });
    }

    // Create transaction
    const transactionID = uuidv4();
    const transaction = {
      transactionID,
      senderID,
      receiverID: receiver.userId,
      type: senderWallet.type,
      walletNumber: senderWallet.walletNumber,
      amount,
      reference,
      timestamp: new Date().toISOString(),
      status: "pending"
    };
    db.transactions.set(transactionID, transaction);

    // Update wallet histories
    senderWallet.history.push(transactionID);
    recipientWallet.history.push(transactionID);
    db.wallets.set(senderWallet.walletId, senderWallet);
    db.wallets.set(recipientWallet.walletId, recipientWallet);

    res.status(201).json({
      message: "Transaction Created",
      status: "pending",
      transactionID
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/getTransaction/:id", authenticateToken, async (req, res) => {
  try {
    const transactionID = req.params.id;
    const transaction = db.transactions.get(transactionID);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({
      id: transaction.transactionID,
      senderID: transaction.senderID,
      receiverID: transaction.receiverID,
      amount: transaction.amount,
      type: transaction.type,
      walletNumber: transaction.walletNumber,
      reference: transaction.reference,
      status: transaction.status,
      timestamp: transaction.timestamp
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// #endregion

// #region Helper Functions
function authTokenGenerator(id, name, surname) {
  const payload = {
    userID: id,
    name: name,
    surname: surname
  };

  const authToken = jwt.sign(payload, privateKey, { expiresIn: '24h' });
  return authToken;
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. Token missing." });
  }

  jwt.verify(token, privateKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }
    req.user = user;
    next();
  });
}
//#endregion

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});