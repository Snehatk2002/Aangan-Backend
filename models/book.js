const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
    name: { type: String, default: null }, // Name of the person booking
    email: { type: String, default: null }, // Email of the person booking
    contact: { type: String, default: null }, // Contact number
    age: { type: Number, default: null }, // Age of the user
    date: { type: String, required: true }, // Date of vaccination
    time: { type: String, required: true }, // Time of the slot
    location: { type: String, required: true }, // Vaccination center location
    vaccineType: { type: String, required: true }, // Covaxin, Covishield, Pfizer, etc.
    status: { type: String, default: "Available" }, // "Available" or "Booked"
    bookedAt: { type: Date, default: null }, // Timestamp of booking
   
});

const SlotModel = mongoose.model("Slot", slotSchema);
module.exports = SlotModel;
