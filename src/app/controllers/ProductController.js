const {formatPrice, date} = require('../../lib/utils')
const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')
const { files } = require('../models/Product')

module.exports = {
    create(req,res){
        //pegar categorias

        Category.all()
        .then(function(results){

            const categories = results.rows;
            return res.render('products/create.njk', {categories})
        }).catch(function(err){
            throw new Error(err)
        })
    },
    async post(req, res){
        const keys = Object.keys(req.body)
    
        for (let key of keys){
            if(req.body[key]==""){
                return res.send("Por favor, preencha todos os campos.")
            }
        }

        if(req.files.length == 0)
            return res.send('Por favor, preencha com ao menos 1 imagem!')

        let results = await Product.create(req.body)
        const productId = results.rows[0].id

        const filesPromise = req.files.map(file => File.create({...file, product_id:productId}))
        await Promise.all(filesPromise)

        return res.redirect(`/products/${productId}`)
    },
    async show(req, res){

        let results = await Product.find(req.params.id)
        const product = results.rows[0]

        if(!product) return res.send("Product Not Found")

        const {day, hour, minutes, month} = date(product.updated_at)

        product.published = {
            day: `${day}/${month}`,
            hour: `${hour}h${minutes},`
        }

        product.oldPrice = formatPrice(product.old_price)
        product.price = formatPrice(product.price)
        return res.render("products/show", {product})

    },
    async edit(req, res) {

        let results = await Product.find(req.params.id)
        const product = results.rows[0]

        if(!product) return res.send("Product not found!")
        
        product.old_price = formatPrice(product.old_price)
        product.price = formatPrice(product.price)
        
        //get categories
        results = await Category.all()
        const categories = results.rows 

        //get images
        results = await Product.files(product.id)
        let files = results.rows

        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", '')}`
        }))

        return res.render(`products/edit.njk`, {product, categories, files})

    },
    async put(req, res) {
        const keys = Object.keys(req.body)
    
        for (let key of keys){
            if(req.body[key]=="" && key !== "removed_files"){
                return res.send("Por favor, prencha todos os campos.")
            }
        }

        if ( req.files.length != 0 ){
            const newFilePromise = req.files.map(file => File.create({...file, product_id: req.body.id}))

            await Promise.all(newFilePromise)
        }

        if(req.body.removed_files){
            
            const removedFiles = req.body.removed_files.split(",") //[1,2,3,]
            const lastIndex = removedFiles.length - 1 // removendo a ??ltima posi????o que vem vazia
            removedFiles.splice(lastIndex, 1) // [1,2,3] pronto!

            const removedFilesPromise = removedFiles.map(id => File.delete(id))

            await Promise.all(removedFilesPromise)
        }

        req.body.price = req.body.price.replace(/\D/g, "")

        if(req.body.old_price != req.body.price){
            const oldProduct = await Product.find(req.body.id)

            req.body.old_price = oldProduct.rows[0].price
        }

        await Product.update(req.body)

        return res.redirect(`/products/${req.body.id}`)

    },
    async delete(req, res) {
        
        await Product.delete(req.body.id)

        return res.redirect(`/products/create`)
    }
}
