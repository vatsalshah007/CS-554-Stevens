const apiRoutes = require("./apiPeople")

const constructorMethod = (app) => {
  app.use('/api/people/', apiRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

module.exports = constructorMethod;