const { SERVER_MALFUNCTION } = require("../utils/errors");

const clothingItem = require("../models/clothingitems");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageURL } = req.body;

  clothingItem
    .create({ name, weather, imageURL })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((err) => {
      res
        .status(SERVER_MALFUNCTION)
        .send({ message: "Error from createItem", err });
    });
};
module.exports = {
  createItem,
};
