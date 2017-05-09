const CreateClient = require('./lib/create');

module.exports.handler = (event, context, callback) => {
  const createClient = new CreateClient(event, process.env.TABLE_NAME);

  createClient.createData().then((response) => {
    callback(null, response);
  }).catch((err) => {
    callback(err);
  });
};
