// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    termsAccepted: {
        type: Boolean,
        required: true
    },
    newsletter: {
        type: Boolean,
        default: false
    },
    name: {
        type: String
    },
    age: {
        type: Number
    },
    weight: {
        type: Number
    },
    height: {
        type: Number
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'] // Optional: restrict to certain values
    },
    diabetesType: {
        type: String,
        enum: ['type1', 'type2', 'pre', 'gestational']
    },
    treatmentMethod: {
        type: String,
        enum: ['pen_syringe', 'pump', 'no_insulin']
    },
    medication: {
        type: String,
        enum: ['sim', 'nao'] // Assuming 'sim' and 'nao' are the possible values
    },
    glycemiaUnit: {
        type: String,
        enum: ['mg/dL', 'mmol/L']
    },
    carbUnit: {
        type: String,
        enum: ['g', 'ex']
    },
    // New field for glycemia value
    glycemiaValue: {
        type: Number,
        min: 20,  // Minimum acceptable value
        max: 600  // Maximum acceptable value
    },
    glycemiaRecordedAt: {
        type: Date
    },
    meterType: {
        type: String
    },
    customMeter: {
        type: String
    },
    sensorType: {
        type: String
    },
    customSensor: {
        type: String
    }
});

module.exports = mongoose.model('User', userSchema);
