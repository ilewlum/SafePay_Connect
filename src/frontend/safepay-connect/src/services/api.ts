import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api.config';

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

class ApiService {
  private token: string | null = null;

  constructor() {
    this.loadToken();
  }

  private async loadToken() {
    try {
      this.token = await AsyncStorage.getItem('authToken');
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
    } catch (error) {
      console.error('Failed to clear token:', error);
    }
  }

  private getHeaders(includeAuth: boolean = true) {
    const headers: any = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Authentication endpoints
  async register(userData: UserData) {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.REGISTER}`, {
        method: 'POST',
        headers: this.getHeaders(false),
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async login(loginData: LoginData) {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: this.getHeaders(false),
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      if (data.token) {
        await this.saveToken(data.token);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    await this.clearToken();
  }

  // Wallet endpoints
  async createWallet(walletData: WalletData) {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CREATE_WALLET}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(walletData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create wallet');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async viewWallet() {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.VIEW_WALLET}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch wallet');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async updateWallet(walletData: Partial<WalletData>) {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.UPDATE_WALLET}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(walletData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update wallet');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Transaction endpoints
  async createTransaction(transactionData: TransactionData) {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CREATE_TRANSACTION}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Backend error:', response.status, response.statusText, error);
        throw new Error(error.message || 'Failed to create transaction');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getTransaction(transactionId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GET_TRANSACTION}/${transactionId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch transaction');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.token !== null;
  }

  // Get current token
  getToken() {
    return this.token;
  }
}

export default new ApiService();