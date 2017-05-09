const AWS = require('aws-sdk');

class GetClient {
  constructor(event, tableName) {
    this.event = event;
    this.tableName = tableName;
    this.documentClient = process.env.IS_LOCALSTACK
      ? new AWS.DynamoDB.DocumentClient(
        {
          region: process.env.DEFAULT_REGION,
          endpoint: process.env.HOSTNAME,
        })
      : new AWS.DynamoDB.DocumentClient();
  }

  validate() {
    return new Promise((resolve, reject) => {
      if (this.event.pathParameters.id) {
        resolve(this.event.pathParameters.id);
      } else {
        reject('Invalid Data');
      }
    });
  }

  get(id) {
    const params = {
      TableName: this.tableName,
      Key: {
        id,
      },
    };
    return this.documentClient.get(params).promise();
  }

  getData() {
    return new Promise((resolve, reject) => {
      this.validate().then((id) => {
        return this.get(id);
      }).then((result) => {
        const response = {
          statusCode: 200,
          body: JSON.stringify(result.Item),
        };
        resolve(response);
      }).catch((err) => {
        const response = {
          statusCode: 500,
          body: JSON.stringify(err),
        };
        reject(response);
      });
    });
  }
}

module.exports = GetClient;
