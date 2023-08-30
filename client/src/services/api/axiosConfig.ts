import axios from "axios";

const token = localStorage.getItem('access_token')

// export const serverUrl = 'https://monapy-server.onrender.com'
// export const serverUrl = 'https://monapy-server.vercel.app'
export const serverUrl = 'http://localhost:7001'

const dev = import.meta.env.DEV 




export const Axios = axios.create({
  baseURL: dev ? serverUrl : '',
  headers: {
    'access_token': token,
    'Content-Type': 'application/json'
  }
});