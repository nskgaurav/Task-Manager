import axios from "axios";
import { BACKEND_SERVER_URL } from "./config";


export const server = axios.create({
    baseURL: BACKEND_SERVER_URL,
    proxy: BACKEND_SERVER_URL,
});

