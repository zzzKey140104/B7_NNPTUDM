let mongoose = require('mongoose');

let productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String
    },
    price: {
        type: Number,
        min: 0,
        default: 0
    },
    description: {
        type: String,
        default: true,
        maxLength: 999
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'category',
        required: true
    },
    images: {
        type: [String],
        default: [
            "https://placeimg.com/640/480/any"
        ]
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})
// Sau khi một product mới được lưu thành công, tự động tạo inventory
productSchema.post('save', async function(doc, next) {
    try {
        const Inventory = mongoose.model('inventory');
        await Inventory.create({
            product: doc._id,
            stock: 0,
            reserved: 0,
            soldCount: 0
        });
        next();
    } catch (error) {
        next(error);
    }
});
module.exports = new mongoose.model('product', productSchema)