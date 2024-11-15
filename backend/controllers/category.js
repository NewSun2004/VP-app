const {Category} = require("../model/model")

const categoryController = {
    addCategory: async (req, res)=>{
        try{
            const newCategory = new Category(req.body);
            const saveCategory = await newCategory.save();
            res.status(200).json(saveCategory)
        }catch(err){
            res.status(500).json(err)
        }
    }
}

module.exports = categoryController