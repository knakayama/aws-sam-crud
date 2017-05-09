const GetClient = require('./lib/get');

module.exports.handler = (event, context, callback) => {
  const getClient = new GetClient(event, process.env.TABLE_NAME);

  getClient.getData().then((response) => {
    callback(null, response);
  }).catch((err) => {
    callback(err);
  });
};
