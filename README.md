Desafio Convem

> OBJETIVO 

Realizar a integração com a API de Pix do Asaas para depósitos e saques.

Escolha uma tecnologia que não tenha tanta prática entre NodeJS c/ Typescript, GoLang ou Rust.


> CASH IN (depósitos)

Faça uma API para gerar o QR Code Pix e salve as informações num banco de dados AWS DynamoDB.

Faça uma API para receber a notificação webhook de cash in enviada pelo Asaas. Essa api deve simplesmente receber o webhook e enviar o payload para uma AWS SQS (fila), usando SDK da AWS.

Suba também uma função AWS Lambda conectada nessa SQS que pegue cada mensagem e atualize o QR Code Pix no AWS DynamoDB.

Crie um script de teste para criar 100 QR Codes (em qualquer linguagem)


> CASH OUT (saques)

Faça uma API para solicitar um cash out e salve as informações num banco de dados AWS DynamoDB.

Faça uma API para receber a notificação de webhook de cash out. Essa api deve simplesmente receber o webhook e enviar o payload para uma AWS SQS (fila), usando SDK da AWS.

Suba também uma função AWS Lambda conectada nessa SQS que pegue cada mensagem e atualize o QR Code Pix no AWS DynamoDB.

Crie um script de teste para criar 100 solicitações de cash out (em qualquer linguagem).


> FRONT

Crie uma tela simples usando uma das seguintes tecnologias (Vite ou Next.Js) que exiba essas transações salvas no DynamoDB, a partir de uma rota GET.

Caso queira, você pode usar alguma biblioteca de componentes (ex: Mui, Tailwind, Bootstrap).
