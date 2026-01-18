import axios from "axios";
// const server = "https://netflow.onrender.com"
const token = localStorage.getItem("token");
const local = "http://localhost:4008"
export const Axios = axios.create({
    
    baseURL:local,
    withCredentials: true,
    headers: {
    Authorization: `Bearer ${token}`,
    },
})