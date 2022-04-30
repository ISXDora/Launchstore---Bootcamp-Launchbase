const express = require('express');
const routes = express.Router()
const multer = require('./app/middlewares/multer')

const ProductController  = require('./app/controllers/ProductController')

routes.get('/', (req, res)=> res.render('layout.njk'))

routes.get('/products/create', ProductController.create);
routes.post('/products', multer.array("photos", 6), ProductController.post);
routes.get('/products/:id', ProductController.show);
routes.get('/products/:id/edit', ProductController.edit);
routes.put('/products/', multer.array("photos", 6) ,ProductController.put)
routes.delete('/products/', ProductController.delete)

//Alias 
routes.get('/ads/create', (req, res) => res.redirect('/products/create'));



module.exports = routes