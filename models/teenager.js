const mongoose = require("mongoose");

const teenagerSchema = new mongoose.Schema({
    name:{ type: String, required: true },
    email:{ type: String, required: true },
    schoolName: { type: String, required: true },
    class: { type: String, required: true },
    height: { type: String, required: true },
    weight: { type: String, required: true },
    healthStatus: { type: String, required: true },
    nutritionStatus: { type: String, required: true },
    vaccinationStatus: { type: String, required: true },
    counselingNeeds: { type: String, required: true },
    financialAid: { type: Boolean, default: false },
    emotionalSupport: { type: Boolean, default: false }
});

const TeenagerModel = mongoose.model("Teenager", teenagerSchema);
module.exports = TeenagerModel;
