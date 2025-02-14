const mongoose = require("mongoose");

const childSchema = new mongoose.Schema({
    name: { type: String, required: true },
    parentName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    healthStatus: { type: String, required: true },
    vaccinationStatus: { type: String, required: true },
    nutritionStatus: { type: String, required: true },
    guardianContact: { type: String, required: true },
    address: { type: String, required: true }
});

const ChildModel = mongoose.model("Child", childSchema);
module.exports = ChildModel;
