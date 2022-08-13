import axios from 'axios';

const NODE_ENV = process.env.NODE_ENV || 'development';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: NODE_ENV === 'development' ? 'http://localhost:4000/api' : 'http://68.183.82.112:4000/api',
  timeout: 20000
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;
