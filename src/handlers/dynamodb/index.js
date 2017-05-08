const AWS = require('aws-sdk');

const documentClient = process.env.IS_LOCALSTACL
  ? new AWS.DynamoDB.DocumentClient(
    {
      region: process.env.DEFAULT_REGION,
      endpoint: process.env.HOSTNAME,
    })
  : new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const uuid = require('uuid');
  const moment = require('moment-timezone');
  const timestamp = moment().tz('Asia/Tokyo').unix();
  const data = JSON.parse(event.body);

  if (typeof data.text !== 'string') {
    callback(new Error('Couldn\'t create the todo item.'));
  }

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      id: uuid.v1(),
      text: data.text,
      checked: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  documentClient.put(params, (err, result) => {
    if (err) {
      callback(new Error('Couldn\'t create the todo item.'));
    }
    console.log(result);

    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};

module.exports.delete = (event, context, callback) => {
  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      id: event.pathParameters.id,
    },
  };

  documentClient.delete(params, (err) => {
    if (err) {
      callback(new Error('Couldn\'t remove the todo item.'));
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify({}),
    };
    callback(null, response);
  });
};

module.exports.get = (event, context, callback) => {
  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      id: event.pathParameters.id,
    },
  };

  documentClient.get(params, (err, result) => {
    if (err) {
      callback(new Error('Couldn\'t fetch the todo item.'));
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
    callback(null, response);
  });
};

module.exports.list = (event, context, callback) => {
  const params = {
    TableName: process.env.TABLE_NAME,
  };

  documentClient.scan(params, (err, result) => {
    if (err) {
      callback(new Error('Couldn\'t fetch the todos.'));
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
    callback(null, response);
  });
};

module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body, (key, value) => {
    if (key === 'checked') return !!value;
    return value;
  });

  if (typeof data.text !== 'string' && typeof data.checked !== 'boolean') {
    callback(new Error('Couldn\'t create the todo item.'));
  }

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      id: event.pathParameters.id,
      text: data.text,
      checked: data.checked,
      updatedAt: timestamp,
    },
  };

  documentClient.put(params, (err, result) => {
    if (err) {
      callback(new Error('Couldn\'t update the todo item.'));
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};
