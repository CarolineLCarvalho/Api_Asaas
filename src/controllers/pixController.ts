import { Request, Response } from 'express';
import client from '../services/asaasService';
import { v4 as uuidv4, v4 } from 'uuid'; // para gerar IDs únicos se precisar
import { dynamoClient } from '../services/dynamodbClient';
import { sendMessageToSQS } from '../services/sqs';
import { PutItemCommand } from '@aws-sdk/client-dynamodb';



export const generatePix = async (req: Request, res: Response) => {
  console.log('Dados recebidos:', req.body);
  const { addressKey, value, format, description = 'ALL' } = req.body;
  const id = v4()

  try {
    const response = await client.post("/pix/qrCodes/static", {
      addressKey,
      value,
      format,
      description,
      externalReference: id
    });

    const { payload, encodedImage } = response.data;
    
    const createdAt = new Date().toISOString()
    const status = "pending"
   
    const params = {
      TableName: "CashIn",
      Item: {
        id: { S: id },
        value: { S: String(value) },
        status: { S: status },
        createdAt: { S: createdAt },
        payload: {S: payload},
        description: {S: description},
        encodedImage: {S: encodedImage}
      },
    };
    console.log("params", params)
    await dynamoClient.send(new PutItemCommand(params));
    console.log(`Depósito salvo com sucesso para ${id}`);

    return res.status(200).json({
      chavePix: payload,
      imagemBase64: encodedImage,
      status
    });
  } catch (error: any) {
    console.error('Erro ao gerar Pix:', error.response?.data || error.message);
    return res.status(500).json({
      error: 'Erro ao gerar Pix',
      details: error.response?.data || error.message
    });
  }
}; 

export const handleCashInWebhook = async (req: Request, res: Response) => {
  try {
    const queueUrl = process.env.SQS_CASHIN_URL!;
    const payload = req.body;

    console.log('Recebido webhook Cash In com payload:', payload);
    console.log('Enviando para fila:', queueUrl);

    await sendMessageToSQS(queueUrl, payload);

    console.log('Webhook Cash In recebido e enviado para SQS');
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Erro ao enviar webhook Cash In para SQS:', error);
    return res.status(500).json({ error: 'Erro ao processar webhook Cash In', });
  }
};

export const requestCashOut = async (req: Request, res: Response) => {
  const { status, value, userId, description } = req.body;

  const withdrawalId = uuidv4(); // ID único para o saque
  const date = new Date().toISOString();

  const params = {
    TableName: process.env.DYNAMODB_CASHOUT_TABLE!,
    Item: {
      id: { S: withdrawalId },
      userId: { S: userId },
      description: { S: description },
      status: { S: status},      
      value: { N: String(value) },
      createdAt: { S: date }
    }
  };

  try {
    await dynamoClient.send(new PutItemCommand(params));
    return res.status(201).json({ message: 'Solicitação de saque registrada com sucesso', id: withdrawalId });
  } catch (error: any) {
    console.error('Erro ao registrar saque no DynamoDB:', error);
    return res.status(500).json({ error: 'Erro ao registrar solicitação de saque', details: error.message || error });
  }

}; 

export const handleCashOutWebhook = async (req: Request, res: Response) => {
  try {
    const queueUrl = process.env.SQS_CASHOUT_URL!;
    const payload = req.body;

    await sendMessageToSQS(queueUrl, payload);

    console.log('Webhook Cash Out recebido e enviado para SQS');
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Erro ao enviar webhook Cash Out para SQS:', error);
    return res.status(500).json({ error: 'Erro ao processar webhook Cash Out' });
  }
};


