const { Carrier } = require("../model/model"); // Import Carrier model

const addCarrier = async (req, res) => {
  try {
    const { shipping_carrier, shipping_methods } = req.body;

    // Validate input
    if (!shipping_carrier || !shipping_methods || !Array.isArray(shipping_methods)) {
      return res.status(400).json({
        message: "Missing required information: shipping_carrier or shipping_methods is invalid."
      });
    }

    // Validate each shipping_method
    for (const method of shipping_methods) {
      if (!method.method_name || method.shipping_fee === undefined) {
        return res.status(400).json({
          message: "Each shipping method must have a method_name and a shipping_fee."
        });
      }
      if (method.shipping_fee < 0) {
        return res.status(400).json({
          message: "shipping_fee must be greater than or equal to 0."
        });
      }
    }

    // Create a new carrier
    const newCarrier = new Carrier({
      shipping_carrier,
      shipping_methods
    });

    // Save to the database
    await newCarrier.save();

    res.status(201).json({
      message: "New carrier added successfully.",
      carrier: newCarrier
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while adding the carrier.", error });
  }
};

const getShippingCarriers = async (req, res) => {
  try {
    // Retrieve all shipping carriers and their related shipping methods
    const carriers = await Carrier.find({}, { _id: 1, shipping_carrier: 1, shipping_methods: 1 });

    // Check if no data is found
    if (!carriers || carriers.length === 0) {
      return res.status(404).json({
        message: "No shipping carriers found."
      });
    }

    res.status(200).json({
      message: "Shipping carriers retrieved successfully.",
      carriers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while retrieving shipping carriers.",
      error
    });
  }
};

module.exports = { addCarrier, getShippingCarriers };
