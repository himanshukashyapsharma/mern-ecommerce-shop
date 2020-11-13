const express = require('express')
const router = express.Router()
const { Product } = require("../models/Product")
const multer = require("multer")
const sharp = require("sharp")

const { auth } = require("../middleware/auth")

//=================================
//             Product
//=================================

// store image
var storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,'uploads/')
    },
    filename: (req,file,cb) => {
        cb(null,`${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req,file,cb) => {
        const ext = path.extname(file.originalname)
        console.log(ext)
        if(ext !== '.jpg' || ext !== '.png'){
            return cb(res.status(400).end('only .jpg, .png are allowed',false))
        }
        cb(null,true)
    }

})


// var upload = multer({storage: storage}).single("file")
var upload = multer({storage: storage})

router.post("/uploadImage",upload.single("file"),(req, res) => {
    let compressedImageFilePath = `uploads/thumbnail_${req.file.filename}`
    sharp(req.file.path)
    .resize(480)
    .toFile(compressedImageFilePath, (err, info) => {
        if (err) res.send({success: false,err})
        return res.json({success: true, image: req.file.path, fileName: req.file.filename})
    })
    
    // upload(req,res,err => {
    //     if(err) return res.json({success: false, err})
    //     return res.json({success: true, image: res.req.file.path, fileName: res.req.file.filename})
    // })
});

router.post("/uploadProduct",auth,(req,res) => {
    const product = new Product(req.body)

    product.save((err) => {
        if(err) return res.status(400).json({success: false, err})
        return res.status(200).json({success: true})
    })
})

// get product details for the landing page

router.post("/getProducts",(req,res) => {

    let limit = req.body.limit ? parseInt(req.body.limit) : 100
    let skip = parseInt(req.body.skip)

    let findArgs = {}
    let term = req.body.searchTerm
    for(let key in req.body.filters){
        if(req.body.filters[key].length > 0){
            if(key === "price"){
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                }
            } else {
                findArgs[key] = req.body.filters[key]
            }
        }
    }

    if(term){
        Product.find(findArgs)
            .find({ $text: { $search: term }})
            .populate('writer')
            .skip(skip)
            .limit(limit)
            .exec((err,products)=>{
                if(err) return res.status(400).json({success: false, err})
                res.status(200).json({success: true, products, postSize: products.length})  
            })
    } else {
        Product.find(findArgs)
            .populate('writer')
            .skip(skip)
            .limit(limit)
            .exec((err,products)=>{
                if(err) return res.status(400).json({success: false, err})
                res.status(200).json({success: true, products, postSize: products.length})  
            })
    }
    
})

// get product detail
// type=single for DetailedProduct component
// type=array for CartPage component

router.get('/products_by_id',(req,res) => {
    
    let type = req.query.type
    let productIds = req.query.id // arrays get converted to json format while sending through a query.

    if(type === "array"){
        let ids = req.query.id.split(",")
        productIds = []
        productIds = ids.map(item => {
            return item
        }) 
    }

    Product.find({"_id" :{$in: productIds}})
    .populate('writer')
    .exec((err,product) => {
        if(err) return res.status(400).json({success: false, err})
        if(type === "array") res.status(200).json({success: true, product})
        if(type === "single") res.status(200).json({success: true, product: product[0]})
    })
})

module.exports = router;
