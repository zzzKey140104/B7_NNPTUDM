const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inventorySchema = new Schema({
    product: { 
        type: Schema.Types.ObjectId, 
        ref: 'product', // Reference tới model product
        required: true, 
        unique: true 
    },
    stock: { type: Number, min: 0, default: 0 },
    reserved: { type: Number, min: 0, default: 0 },
    soldCount: { type: Number, min: 0, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('inventory', inventorySchema);