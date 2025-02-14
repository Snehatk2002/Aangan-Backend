const mongoose = require("mongoose");

const pregnantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dueDate: { type: String, required: true },
    trimester: { type: String, required: true },
    doctorName: { type: String },
    hospitalName: { type: String },
    pregnancies: { type: Number, default: 0 },
    children: { type: Number, default: 0 },
    miscarriages: { type: Number, default: 0 },
    lastCheckup: { type: String },
    healthStatus: { type: String },
    vaccinationDetails: { type: String }
});

const PregnantModel = mongoose.model("pregnant", pregnantSchema);
module.exports = PregnantModel;
