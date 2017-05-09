const ListClient = require('./lib/list');

module.exports.handler = (event, context, callback) => {
  const listClient = new ListClient(process.env.TABLE_NAME);

  listClient.listData().then((response) => {
    callback(null, response);
  }).catch((err) => {
    callback(err);
  });
};
