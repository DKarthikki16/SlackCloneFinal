import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/token/';

export const Login = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/login/`, { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};