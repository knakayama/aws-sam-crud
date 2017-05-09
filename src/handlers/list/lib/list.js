const AWS = require('aws-sdk');

class ListClient {
  constructor(tableName) {
    this.tableName = tableName;
    this.documentClient = process.env.IS_LOCALSTACL
      ? new AWS.DynamoDB.DocumentClient(
        {
          region: process.env.DEFAULT_REGION,
          endpoint: process.env.HOSTNAME,
        })
      : new AWS.DynamoDB.DocumentClient();
  }

  list() {
    const params = {
      TableName: this.tableName,
    };

    return this.documentClient.scan(params).promise();
  }

  listData() {
    return new Promise((resolve, reject) => {
      this.list().then((result) => {
        const response = {
          statusCode: 200,
          body: JSON.stringify(result.Items),
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

module.exports = ListClient;
