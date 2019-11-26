var secured = require('../../lib/middleware/secured');
const ItemsModel = require('../../models/items');

module.exports = function (router) {

  router.post('', secured.authenticated(false), secured.admin(), addItem);

  router.put('/:id', secured.authenticated(false), updateItem);

  router.delete('/:id', secured.authenticated(false), secured.admin(), deleteItem);

};

const updateItem = (req, res) => {
  const itemsModel = new ItemsModel();
  itemsModel.updateItem(req.params.id, req.body)
    .then((item) => {
      res.json(item)
    });
};

const deleteItem = (req, res) => {
  const itemsModel = new ItemsModel();
  itemsModel.deleteItem(req.params.id)
    .then(() => {
      res.sendStatus(204);
    });
};

const addItem = (req, res) => {
  const itemsModel = new ItemsModel();
  itemsModel.addItem(req.body)
    .then((item) => {
      res.json(item);
    });
};
