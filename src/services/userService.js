import axios from 'axios';

const API_BASE_URL = 'https://9e06da9a-97cf-4701-adfc-9b9a5713bbb9.mock.pstmn.io';

const userService = {
  async getUsers() {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      return response?.data?.data?.users || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users. Please try again later.');
    }
  }
};

export default userService;
