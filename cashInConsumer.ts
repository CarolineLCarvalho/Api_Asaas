import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const dynamoClient = new DynamoDBClient({ region: "us-east-2" });

export const handler = async (event: any) => {
  try {
    for (const record of event.Records) {
      const body = JSON.parse(record.body);

      const { id, userId, value, status, payload, description, encodedImage } = body;
      const createdAt = new Date().toISOString();

      const params = {
        TableName: "CashIn",
        Item: {
          id: { S: id },
          userId: { S: userId },
          value: { N: String(value) },
          status: { S: status || "RECEIVED" },
          createdAt: { S: createdAt },
          ...(payload && { payload: { S: payload } }),
          ...(description && { description: { S: description } }),
          ...(encodedImage && { encodedImage: { S: encodedImage } }),
        },
      };

      await dynamoClient.send(new PutItemCommand(params));
      console.log(`Depósito salvo com sucesso para usuário ${userId}`);
    }

    return { statusCode: 200 };
  } catch (error) {
    console.error("Erro ao salvar depósito:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Erro interno" }) };
  }
};
