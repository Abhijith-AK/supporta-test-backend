const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    brandName: {
        type: String,
        required: true,
        unique: true
    },
    brandLogo: {
        type: String,
        default: "NIL"
    },
    categories: [
        {
            type: String
        }
    ]
}, { timestamps: true });

const Brand = mongoose.model('brands', brandSchema);

module.exports = Brand
