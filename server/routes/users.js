const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");
const {Product} = require("../models/Product")
const {Payment} = require("../models/Payment")
const async = require("async")

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
        cart: req.user.cart,
        history: req.user.history
    });
});

router.post("/register", (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login", (req, res) => {
    // console.log("api working!")
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res.cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

// User logout

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

// User add product to cart

router.post("/addToCart",auth,(req,res) => {
        // console.log("inside add to cart")

    User.findOne({_id: req.user._id},(err, userInfo) => {
        let duplicate = false
        console.log(userInfo)
        userInfo.cart !== undefined && userInfo.cart.forEach((cartInfo) => {
            if(cartInfo.id === req.query.productId){
                duplicate = true
                console.log("duplicate item.")
            } else {
                console.log("not duplicate")
            }
        })

        if(duplicate) {
            User.findOneAndUpdate(
                {_id: req.user._id, "cart.id": req.query.productId},
                {"$inc": {"cart.$.quantity" : 1}},
                {new: true},
                (err,userInfo) => {
                    if (err) return res.json({success: false, err})
                    res.status(200).json(userInfo.cart)
                }
            )
        } else{
            User.findOneAndUpdate(
                {_id: req.user._id},
                {
                    $push: {
                        cart: {
                            id: req.query.productId,
                            quantity: 1,
                            date: Date.now()
                        }
                    }
                },
                {new: true},
                (err, userInfo) => {
                    if (err) return res.json({success: false, err})
                    res.status(200).json(userInfo.cart)
                }
            )

        }
    })
})

router.get("/removeFromCart", auth ,(req,res) => {
    let productId = req.query.productId
    let userId = req.user._id

    User.findOneAndUpdate( {_id: userId},{"$pull": {"cart": {"id": productId}}},{new: true},(err,userInfo) => {
        if (err) return res.json({success: false, err})
        
            let cart = userInfo.cart
            productIds = []
            productIds = cart.map(item => {
                return item.id
            }) 
    
        Product.find({"_id" :{$in: productIds}})
        .populate('writer')
        .exec((err,product) => {
            console.log("-----------------------------------------------------------------------")
            console.log(cart,product)
            console.log("-----------------------------------------------------------------------")
            if(err) return res.status(400).send(err)
            res.status(200).json({product,cart})
        })
    })
})

router.post('/successBuy', auth, (req,res) => {
    let history = []
    let transactionData = {}

    //-------------------
    req.body.cartDetail.forEach(item => {
        history.push({
            dateOfPurchase: Date.now(),
            name: item.title,
            productId: item._id,
            price: item.price,
            quantity: item.quantity,
            paymentId: req.body.paymentData.paymentID
        })
    })
    //-----------------
    transactionData.user = {
        id: req.user._id,
        name: req.user.name,
        lastname: req.user.lastname,
        email: req.user.email
    }

    transactionData.data = req.body.paymentData
    transactionData.product = history
    User.findOneAndUpdate(
        {_id: req.user._id},
        {$push: {history: history}, $set: {cart: []}},
        {new: true},
        (err,user) => {
            if (err) return res.json({success: false, err})

            const payment = new Payment(transactionData)
            payment.save((err, doc) => {
                if (err) return res.json({success: false, err})
        
            
            let products = []
            doc.product.forEach(item => {
                products.push({id: item.id, quantity: item.quantity})
            })

            async.eachSeries(products, (item, callback) => {
                Product.updateOne(
                    {_id: item.id},
                    {
                        $inc: {
                            "sold": item.quantity
                        }
                    },
                    {new: false},
                    callback
                )
            }, (err) => {
                if (err) return res.json({success: false, err})
                res.status(200).json({
                    success: true,
                    cart: user.cart,
                    cartDetail: []
                })
            })
        })
    })

})

module.exports = router;
