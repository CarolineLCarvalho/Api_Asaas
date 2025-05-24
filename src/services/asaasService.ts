import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();


const ASAAS_API_BASE = 'https://sandbox.asaas.com/api/v3';
const API_KEY = process.env.ASAAS_API_KEY || ''; //chave esta no .env :)

const client = axios.create({
  baseURL: ASAAS_API_BASE,
 headers: {
  'Content-Type': 'application/json',
  'access_token': '$' + API_KEY
}
});


export default client;

