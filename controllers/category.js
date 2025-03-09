const Category = require('../models/Category');

// CREATE CATEGORY
exports.create = async (req, res, next) => {

    try {

        // console.log(req.body);
        const category = await Category.create(req.body);

        res.json({
            message: "Category succesfully created!",
            category: category,
        })

    } catch (err) {
        console.log(err);
    }

}


// GET SINGLE CATEGORY BY ID
exports.getCategory = async (req, res, next) => {

    try {
        const category = await Category.findById(req.params.id);

        res.json({
            message: "Single category retrieved!",
            category: category,
        })


    } catch (error) {
        console.log(error);
    }

}



// ALL CATEGORY
exports.getAllCategory = async (req, res, next) => {

    try {

        const categories = await Category.find();

        res.json({
            message: "Categories retrieved!",
            categories: categories,
        })

    } catch (error) {

        console.log(error);
    }

}



// UPDATE CATEGORY
exports.update = async (req, res, next) => {

    try {

        // const category = await Category.findById(req.params.id);

        // category.name = req.body.name
        // category.description = req.body.description

        // category.save();

        const category = await Category.findByIdAndUpdate(req.params.id, req.body);


        res.json({
            message: "Category updated successfully!",
            category: category,
        })

    } catch (error) {

        console.log(error);
    }

}


// DELETE CATEGORY
exports.deleteCategory = async (req, res, next) => {

    try {

        await Category.findByIdAndDelete(req.params.id)

        res.json({
            message: "Category deleted successfully!",
        })

    } catch (err) {

        console.log(err);

    }

}