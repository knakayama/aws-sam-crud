const AWS = require('aws-sdk');

const moment = require('moment-timezone');

class UpdateClient {
  constructor(event, tableName) {
    this.event = event;
    this.timestamp = moment().tz('Asia/Tokyo').unix();
    this.tableName = tableName;
    this.checked = true;
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
      const data = JSON.parse(this.event.body);
      if (typeof data.text === 'string' && (this.event.pathParameters.id)) {
        resolve({ text: data.text, id: this.event.pathParameters.id });
      } else {
        reject('Invalid Data');
      }
    });
  }

  update(data) {
    const params = {
      TableName: this.tableName,
      Item: {
        id: data.id,
        text: data.text,
        checked: this.checked,
        updatedAt: this.timestamp,
      },
    };
    return this.documentClient.put(params).promise();
  }

  updateData() {
    return new Promise((resolve, reject) => {
      this.validate().then((data) => {
        return this.update(data);
      }).then(() => {
        const response = {
          statusCode: 200,
          body: JSON.stringify({}),
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

module.exports = UpdateClient;
