const Inventory = require('../schemas/inventory');

// 1. Get all inventories (Join với product)
exports.getAll = async (req, res) => {
    try {
        const inventories = await Inventory.find().populate('product');
        res.status(200).json({ success: true, data: inventories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Get inventory by ID (Join với product)
exports.getById = async (req, res) => {
    try {
        const inventory = await Inventory.findById(req.params.id).populate('product');
        if (!inventory) return res.status(404).json({ success: false, message: 'Không tìm thấy Inventory' });
        
        res.status(200).json({ success: true, data: inventory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Add Stock (Tăng stock)
exports.addStock = async (req, res) => {
    try {
        const { product, quantity } = req.body;
        if (quantity <= 0) return res.status(400).json({ message: 'Quantity phải lớn hơn 0' });

        const inventory = await Inventory.findOneAndUpdate(
            { product: product },
            { $inc: { stock: quantity } },
            { new: true, runValidators: true }
        );
        
        if (!inventory) return res.status(404).json({ message: 'Không tìm thấy Inventory cho Product này' });
        res.status(200).json({ success: true, data: inventory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Remove Stock (Giảm stock)
exports.removeStock = async (req, res) => {
    try {
        const { product, quantity } = req.body;
        if (quantity <= 0) return res.status(400).json({ message: 'Quantity phải lớn hơn 0' });

        const inventory = await Inventory.findOne({ product });
        if (!inventory) return res.status(404).json({ message: 'Không tìm thấy Inventory' });
        if (inventory.stock < quantity) return res.status(400).json({ message: 'Stock hiện tại không đủ để giảm' });

        inventory.stock -= quantity;
        await inventory.save();
        
        res.status(200).json({ success: true, data: inventory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. Reservation (Giảm stock, tăng reserved)
exports.reservation = async (req, res) => {
    try {
        const { product, quantity } = req.body;
        if (quantity <= 0) return res.status(400).json({ message: 'Quantity phải lớn hơn 0' });

        const inventory = await Inventory.findOne({ product });
        if (!inventory) return res.status(404).json({ message: 'Không tìm thấy Inventory' });
        if (inventory.stock < quantity) return res.status(400).json({ message: 'Stock hiện tại không đủ để reserve' });

        inventory.stock -= quantity;
        inventory.reserved += quantity;
        await inventory.save();
        
        res.status(200).json({ success: true, data: inventory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 6. Sold (Giảm reserved, tăng soldCount)
exports.sold = async (req, res) => {
    try {
        const { product, quantity } = req.body;
        if (quantity <= 0) return res.status(400).json({ message: 'Quantity phải lớn hơn 0' });

        const inventory = await Inventory.findOne({ product });
        if (!inventory) return res.status(404).json({ message: 'Không tìm thấy Inventory' });
        if (inventory.reserved < quantity) return res.status(400).json({ message: 'Số lượng reserved không đủ để bán' });

        inventory.reserved -= quantity;
        inventory.soldCount += quantity;
        await inventory.save();
        
        res.status(200).json({ success: true, data: inventory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};