const DeleteClient = require('./lib/delete');

module.exports.handler = (event, context, callback) => {
  const deleteClient = new DeleteClient(event, process.env.TABLE_NAME);

  deleteClient.deleteData().then((response) => {
    callback(null, response);
  }).catch((err) => {
    callback(err);
  });
};
