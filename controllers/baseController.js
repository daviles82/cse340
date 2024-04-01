const utilities = require('../utilities/');
const baseController = {};

baseController.buildHome = async function (req, res) {
  const header = await utilities.getHeader();
  const nav = await utilities.getNav();
  req.flash('notice', 'This is a flash message.');
  res.render('index', { title: 'Home', nav, header});
};

module.exports = baseController;
