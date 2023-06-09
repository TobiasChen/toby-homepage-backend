const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    let body;
    let statusCode = 200;
    const headers = {
        'Content-Type': 'application/json',
    };
    try {
        switch (event.httpMethod) {
            case 'GET':
                const param = {
                    TableName: "homepage-dynamodb",
                    Key: {
                        "id" : 0
                    },
                    UpdateExpression: "SET visits = if_not_exists(visits, :zero) + :incr",
                    ReturnValues: "ALL_NEW",
                    ExpressionAttributeValues: {':incr':1, ':zero':0}
                }
                body = await dynamo.update(param).promise()
                break;
            default:
                throw new Error(`Unsupported method "${event.httpMethod}"`);
        }
    } catch (err) {
        if(err.message.startsWith('Unsupported method')){
            statusCode = 405
        } else {
        statusCode = 400;
            
        }
        body = err.message;
    } finally {
        body = JSON.stringify(body);
    }
    return {
        statusCode,
        body,
        headers,
    };
};
