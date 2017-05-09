const UpdateClient = require('./lib/update');

module.exports.handler = (event, context, callback) => {
  const updateClient = new UpdateClient(event, process.env.TABLE_NAME);

  updateClient.updateData().then((response) => {
    callback(null, response);
  }).catch((err) => {
    callback(err);
  });
};
