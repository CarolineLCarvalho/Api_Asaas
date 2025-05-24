import { Router } from 'express';
import {
  generatePix,
  handleCashInWebhook,
  requestCashOut,
  handleCashOutWebhook,
} from '../controllers/pixController';
import { RequestHandler } from '../services/utils/requestHandler';
import { getTransactions } from '../controllers/transactionController';

const router = Router();

router.post('/cash-in', RequestHandler(generatePix)); 

router.post('/cash-in/webhook', RequestHandler(handleCashInWebhook)); 

router.post('/cash-out', RequestHandler(requestCashOut)); 

router.post('/cash-out/webhook', RequestHandler(handleCashOutWebhook));

router.get('/transactions', RequestHandler(getTransactions));

export default router;