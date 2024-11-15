const {Order} = require("../model/model")

const orderController = {
    addOrder: async (req, res)=>{
        try{
            const newOrder = new Order(req.body);
            const saveOrder = await newOrder.save();
            res.status(200).json(saveOrder)
        }catch(err){
            res.status(500).json(err)
        }
    }
}

module.exports = orderController