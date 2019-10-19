var express = require('express');
var router = express.Router();
var ProductModel = require('../models/product');

router.get('/getAllProducts', (req, res) => {
  const products = new Promise((resolve, reject) => {
    ProductController.find({}, (err, data) => {
      if (!err) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
  if (products) {
    res.send({ status: true, message: 'All Products', data: products });
  } else {
    res.send({
      status: false,
      message: 'Unable to get all products',
      data: {}
    });
  }
});

router.get('/getProductDetails/:id/:title', (req, res) => {
  const products = new Promise((resolve, reject) => {
    ProductModel.findOne({ _id: req.params.id }, (err, data) => {
      if (!err) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
  if (products) {
    res.send({ status: true, message: 'Product found', data: products });
  } else {
    res.send({
      status: false,
      message: 'Unable to get all product',
      data: {}
    });
  }
});

router.get('/getCategoryProducts/:category_name', (req, res) => {
  const products = new Promise((resolve, reject) => {
    ProductModel.find(
      { category_name: req.params.category_name },
      (err, data) => {
        if (!err) {
          resolve(data);
        } else {
          reject(err);
        }
      }
    );
  });
  if (products) {
    res.send({ status: true, message: 'Product found', data: products });
  } else {
    res.send({
      status: false,
      message: 'Unable to get all product',
      data: {}
    });
  }
});

router.post('/addProduct', async (req, res) => {
  var product_details = req.body;
  var product = new ProductModel();

  product.name = product_details.name;
  product.status = product_details.status;
  product.mode = product_details.mode;
  product.user_id = product_details.user_id;
  product.user_name = product_details.user_name;
  product.category_name = product_details.category_name;
  product.brand_name = product_details.brand_name;
  product.brand_id = product_details.brand_id;
  product.created_at = new Date.now();
  product.status = new Date.now();
  product.description = product_details.description;
  product.location.lat = product_details.lat;
  product.location.long = product_details.long;
  product.price = product_details.price;
  product.condition = product_details.condition;

  const saved_product = await new Promise((resolve, reject) => {
    product.save((err, new_product) => {
      if (!err) {
        resolve(new_product);
      } else {
        reject(err);
      }
    });
  });
  if (saved_product) {
    res.send({ status: true, message: 'Product saved', data: products });
  } else {
    res.send({ status: false, message: 'Unable to save product', data: {} });
  }
});
