import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserData {
  name: string;
  surname: string;
  username: string;
  phoneNumber: string;
  password: string;
  email: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface WalletData {
  provider: string;
  type: string;
  walletNumber: string;
}

interface TransactionData {
  username: string;
  amount: number;
  reference: string;
}

interface AnalyzeRequestData {
  message: string;
}

// Dummy data storage
const dummyUsers = [
  {
    userId: 'user_001',
    name: 'John',
    surname: 'Doe',
    username: 'johndoe',
    phoneNumber: '+27123456789',
    email: 'john@example.com',
    password: 'password123'
  },
  {
    userId: 'user_002',
    name: 'Jane',
    surname: 'Smith',
    username: 'janesmith',
    phoneNumber: '+27987654321',
    email: 'jane@example.com',
    password: 'password456'
  }
];

const dummyWallets = [
  {
    id: 'wallet_001',
    userId: 'user_001',
    provider: 'FNB',
    type: 'Savings',
    walletNumber: '62738495',
    balance: 15000.50
  },
  {
    id: 'wallet_002',
    userId: 'user_002',
    provider: 'Standard Bank',
    type: 'Cheque',
    walletNumber: '98765432',
    balance: 8500.00
  }
];

const dummyTransactions = [
  {
    id: 'trans_001',
    userId: 'user_001',
    username: 'johndoe',
    amount: 500.00,
    reference: 'Groceries',
    date: new Date('2025-01-10').toISOString(),
    type: 'sent',
    status: 'completed',
    recipient: 'janesmith'
  },
  {
    id: 'trans_002',
    userId: 'user_001',
    username: 'johndoe',
    amount: 1200.00,
    reference: 'Rent payment',
    date: new Date('2025-01-08').toISOString(),
    type: 'sent',
    status: 'completed',
    recipient: 'landlord'
  },
  {
    id: 'trans_003',
    userId: 'user_001',
    username: 'johndoe',
    amount: 2500.00,
    reference: 'Salary',
    date: new Date('2025-01-05').toISOString(),
    type: 'received',
    status: 'completed',
    sender: 'employer'
  },
  {
    id: 'trans_004',
    userId: 'user_001',
    username: 'johndoe',
    amount: 150.00,
    reference: 'Coffee',
    date: new Date('2025-01-12').toISOString(),
    type: 'sent',
    status: 'pending',
    recipient: 'cafe'
  }
];

const scamMessages = [
  'Congratulations! You won R1,000,000! Click here to claim',
  'Your bank account will be suspended. Verify now!',
  'URGENT: Update your banking details immediately'
];

class DummyApiService {
  private token: string | null = null;
  private currentUser: any = null;

  constructor() {
    this.loadToken();
  }

  private async loadToken() {
    try {
      this.token = await AsyncStorage.getItem('authToken');
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      }
    } catch (error) {
      console.error('Failed to load token:', error);
    }
  }

  private async saveToken(token: string) {
    try {
      await AsyncStorage.setItem('authToken', token);
      this.token = token;
    } catch (error) {
      console.error('Failed to save token:', error);
    }
  }

  private async clearToken() {
    try {
      await AsyncStorage.removeItem('authToken');
      this.token = null;
      this.currentUser = null;
    } catch (error) {
      console.error('Failed to clear token:', error);
    }
  }

  private delay(ms: number = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Authentication endpoints
  async register(userData: UserData) {
    await this.delay();

    // Check if user already exists
    const existingUser = dummyUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Add new user to dummy data
    const newUser = {
      userId: `user_${Date.now()}`,
      ...userData
    };
    dummyUsers.push(newUser);

    return {
      success: true,
      message: 'Registration successful',
      userId: newUser.userId
    };
  }

  async login(loginData: LoginData) {
    await this.delay();

    // Find user with matching credentials
    const user = dummyUsers.find(
      u => u.email === loginData.email && u.password === loginData.password
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const token = `dummy_token_${Date.now()}`;
    await this.saveToken(token);

    this.currentUser = user;

    return {
      token,
      userId: user.userId,
      username: user.username,
      name: user.name,
      surname: user.surname,
      email: user.email
    };
  }

  async logout() {
    await this.clearToken();
  }

  // Wallet endpoints
  async createWallet(walletData: WalletData) {
    await this.delay();

    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }

    const newWallet = {
      id: `wallet_${Date.now()}`,
      userId: this.currentUser.userId,
      ...walletData,
      balance: Math.random() * 20000 + 1000 // Random balance between 1000-21000
    };

    dummyWallets.push(newWallet);

    return {
      success: true,
      message: 'Wallet created successfully',
      wallet: newWallet
    };
  }

  async viewWallet() {
    await this.delay();

    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }

    const userWallet = dummyWallets.find(w => w.userId === this.currentUser.userId) || dummyWallets[0];

    return {
      success: true,
      wallet: userWallet
    };
  }

  async updateWallet(walletData: Partial<WalletData>) {
    await this.delay();

    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }

    const walletIndex = dummyWallets.findIndex(w => w.userId === this.currentUser.userId);
    if (walletIndex === -1) {
      throw new Error('Wallet not found');
    }

    dummyWallets[walletIndex] = {
      ...dummyWallets[walletIndex],
      ...walletData
    };

    return {
      success: true,
      message: 'Wallet updated successfully',
      wallet: dummyWallets[walletIndex]
    };
  }

  // Transaction endpoints
  async createTransaction(transactionData: TransactionData) {
    await this.delay();

    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }

    const newTransaction = {
      id: `trans_${Date.now()}`,
      userId: this.currentUser.userId,
      ...transactionData,
      date: new Date().toISOString(),
      type: 'sent',
      status: 'pending',
      recipient: transactionData.username
    };

    dummyTransactions.push(newTransaction);

    // Simulate transaction processing
    setTimeout(() => {
      const trans = dummyTransactions.find(t => t.id === newTransaction.id);
      if (trans) {
        trans.status = 'completed';
      }
    }, 3000);

    return {
      success: true,
      message: 'Transaction initiated',
      transaction: newTransaction
    };
  }

  async getTransaction(transactionId: string) {
    await this.delay();

    const transaction = dummyTransactions.find(t => t.id === transactionId);

    if (!transaction) {
      // Return a dummy transaction if not found
      return {
        success: true,
        transaction: dummyTransactions[0]
      };
    }

    return {
      success: true,
      transaction
    };
  }

  async getTransactions() {
    await this.delay();

    if (!this.currentUser) {
      return {
        success: true,
        transactions: dummyTransactions
      };
    }

    // Return transactions for current user or all dummy transactions
    const userTransactions = dummyTransactions.filter(t => t.userId === this.currentUser.userId);

    return {
      success: true,
      transactions: userTransactions.length > 0 ? userTransactions : dummyTransactions
    };
  }

  async analyzeMessage(message: AnalyzeRequestData) {
    await this.delay();

    const messageText = message.message.toLowerCase();

    // Simple scam detection logic
    const suspiciousKeywords = ['won', 'claim', 'urgent', 'suspended', 'verify', 'click here', 'prize', 'congratulations'];
    const isSuspicious = suspiciousKeywords.some(keyword => messageText.includes(keyword));

    const riskScore = isSuspicious ? Math.random() * 50 + 50 : Math.random() * 30;

    return {
      success: true,
      analysis: {
        isScam: isSuspicious,
        riskScore: riskScore.toFixed(1),
        confidence: (Math.random() * 30 + 70).toFixed(1),
        reasons: isSuspicious ? [
          'Message contains suspicious keywords',
          'Urgent action requested',
          'Potential phishing attempt'
        ] : [
          'Message appears legitimate',
          'No suspicious patterns detected'
        ],
        recommendation: isSuspicious ?
          'Do not click any links or provide personal information' :
          'Message appears safe, but always verify sender identity'
      }
    };
  }

  // Additional helper methods for demo
  async getTrendingScams() {
    await this.delay();

    return {
      success: true,
      scams: [
        {
          id: 1,
          title: 'Banking SMS Scam',
          description: 'Fake messages claiming to be from banks',
          reportedCount: 1250,
          riskLevel: 'High'
        },
        {
          id: 2,
          title: 'Prize Winner Scam',
          description: 'Messages claiming you won a prize',
          reportedCount: 890,
          riskLevel: 'Medium'
        },
        {
          id: 3,
          title: 'Tax Refund Scam',
          description: 'Fake SARS refund notifications',
          reportedCount: 650,
          riskLevel: 'High'
        }
      ]
    };
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.token !== null;
  }

  // Get current token
  getToken() {
    return this.token;
  }

  // Get user balance (for wallet display)
  async getBalance() {
    await this.delay();

    if (!this.currentUser) {
      return { balance: 5000.00 };
    }

    const userWallet = dummyWallets.find(w => w.userId === this.currentUser.userId);
    return {
      balance: userWallet?.balance || 5000.00
    };
  }
}

export default new DummyApiService();