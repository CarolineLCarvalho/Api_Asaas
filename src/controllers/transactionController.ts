import { Request, Response } from 'express';
import { dynamoClient } from '../services/dynamodbClient';
import { ScanCommand } from '@aws-sdk/client-dynamodb';

export const getTransactions = async (req: Request, res: Response) => {
  try {
    console.log('Buscando transações do DynamoDB...');
    
    // Buscar transações de Cash In
    const cashInParams = {
      TableName: "CashIn",
    };
    
    const cashInCommand = new ScanCommand(cashInParams);
    const cashInResult = await dynamoClient.send(cashInCommand);
    
    // Buscar transações de Cash Out
    const cashOutParams = {
      TableName: process.env.DYNAMODB_CASHOUT_TABLE || "CashOut",
    };
    
    const cashOutCommand = new ScanCommand(cashOutParams);
    const cashOutResult = await dynamoClient.send(cashOutCommand);
    
    // Formatar transações de Cash In
    const cashInTransactions = (cashInResult.Items || []).map(item => ({
      id: item.id?.S || '',
      value: item.value?.S || '0',
      status: item.status?.S || 'unknown',
      createdAt: item.createdAt?.S || '',
      type: 'cash_in',
      payload: item.payload?.S || '',
      encodedImage: item.encodedImage?.S || '',
    }));
    
    // Formatar transações de Cash Out
    const cashOutTransactions = (cashOutResult.Items || []).map(item => ({
      id: item.id?.S || '',
      value: item.value?.N || '0',
      status: item.status?.S || 'unknown',
      createdAt: item.createdAt?.S || '',
      type: 'cash_out',
      userId: item.userId?.S || '',
      description: item.description?.S || '',
    }));
    
    // Combinar e ordenar por data (mais recente primeiro)
    const allTransactions = [...cashInTransactions, ...cashOutTransactions]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    console.log(`Encontradas ${allTransactions.length} transações`);
    
    return res.status(200).json(allTransactions);
  } catch (error: any) {
    console.error('Erro ao buscar transações:', error);
    return res.status(500).json({
      error: 'Erro ao buscar transações',
      details: error.message || error
    });
  }
};