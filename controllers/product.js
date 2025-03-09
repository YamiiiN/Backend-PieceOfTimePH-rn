const Product = require('../models/Product');
const cloudinary = require('cloudinary');

// CREATE PRODUCT
exports.create = async (req, res, next) => {

    try {

        // console.log(req.body);
        // console.log(req.files);

        // EMPTY ARRAY PARA SA IMAGES
        req.body.images = [];

        const images = req.files;

        for (let i = 0; i < images.length; i++) {

            const data = await cloudinary.v2.uploader.upload(images[i].path);

            // console.log(data);

            req.body.images.push({

                public_id: data.public_id,
                url: data.url,

            })
        }

        const product = await Product.create(req.body);

        res.json({
            message: "Product created successfully.",
            product: product,
        })


    } catch (error) {

        res.json({
            message: ""
        })
        console.log(error);

    }

}


// UPDATE PRODUCT
exports.update = async (req, res, next) => {

    try {

        // console.log(req.body);
        // console.log(req.params);
        // console.log(req.files);

        const images = req.files;

        // console.log(images);

        req.body.images = [];

        for (let i = 0; i < images.length; i++) {

            const data = await cloudinary.v2.uploader.upload(images[i].path);

            console.log(data);

            req.body.images.push({

                public_id: data.public_id,

                url: data.url,

            })
        };

        // DELETE EMPTY ARRAY KAPAG HINDI NAG UPDATE NG IMAGES
        if (images.length === 0) {
            delete req.body.images
        }

        const product = await Product.findByIdAndUpdate(req.params.id, req.body);

        res.json({
            message: "Product successfully updated.",
            product: product,
        })

    } catch (error) {

        console.log(error);

    }

}


// GET SINGLE PRODUCT BY ID
exports.getSingle = async (req, res, next) => {

    try {

        // .populate (aggregate join tables)
        const product = await Product.findById(req.params.id).populate({
            path: 'category',
            model: 'Category',
        });

        return res.json({
            message: "Single product retrieved successfully.",
            product: product,
        })

    } catch (error) {

        console.log(error);

        return res.json({
            message: 'System error occured.',
            success: false,
        })

    }

}


// GET ALL PRODUCTS
exports.all = async (req, res, next) => {

    try {

        // .populate (aggregate join tables)
        const products = await Product.find().populate({
            path: 'category',
            model: 'Category',
        });

        return res.json({
            message: "All available products retrieved successfully.",
            products: products,
        })

    } catch (error) {

        console.log(error);

        return res.json({
            message: 'System error occured.',
            success: false,
        })

    }

}



// DELETE PRODUCT
exports.deleteProduct = async (req, res, next) => {

    try {

        await Product.findByIdAndDelete(req.params.id)

        res.json({
            message: "Product deleted successfully!",
        })

    } catch (error) {

        console.log(error);

        return res.json({
            message: 'System error occured.',
            success: false,
        })

    }

}



// BULK DELETE
// exports.bulkDelete = async (req, res, next) => {
//     try {

//         // console.log(req.body.productIds);

//         await Product.deleteMany({
//             _id: {
//                 $in: req.body.productIds, //$in array pang store ng iddedelete na product id
//             }
//         });

//         res.json({
//             message: "Products deleted successfully!",
//         })

//     } catch (error) {

//         console.log(error);

//         return res.json({
//             message: 'System error occured.',
//             success: false,
//         })

//     }
// }