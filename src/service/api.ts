import axios, { AxiosInstance } from "axios";

const BACKEND_URL = 'https://ecrz-back.onrender.com';
const REQUEST_TIMEOUT = 5000;

const createAPI = (): AxiosInstance => {
    const api = axios.create({
        baseURL: BACKEND_URL,
        timeout: REQUEST_TIMEOUT,
    })
    
    return api;
}

export { createAPI }