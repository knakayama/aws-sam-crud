const AWS = require('aws-sdk');

const uuid = require('uuid');

const moment = require('moment-timezone');

class CreateClient {
  constructor(event, tableName) {
    this.event = event;
    this.tableName = tableName;
    this.id = uuid();
    this.timestamp = moment().tz('Asia/Tokyo').unix();
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
      if (typeof data.text === 'string') {
        resolve(data.text);
      } else {
        reject('Invalid Data');
      }
    });
  }

  create(text) {
    const params = {
      TableName: this.tableName,
      Item: {
        id: this.id,
        text,
        checked: false,
        createdAt: this.timestamp,
        updatedAt: this.timestamp,
      },
    };
    return this.documentClient.put(params).promise();
  }

  createData() {
    return new Promise((resolve, reject) => {
      this.validate().then((text) => {
        return this.create(text);
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

module.exports = CreateClient;
