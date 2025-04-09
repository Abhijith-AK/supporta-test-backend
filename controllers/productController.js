const Product = require('../models/Product');
const Brand = require('../models/Brand');
const User = require('../models/User');

exports.addProductController = async (req, res) => {
    const { productName, description, price, category, brand } = req.body;
    const productImage = req.file ? req.file.filename : null;

    if (!productName || !description || !price || !category || !brand || !productImage) {
        return res.status(401).json("All fields are required!")
    }

    try {
        // Check if brand exists
        const brandData = await Brand.findById(brand);
        if (!brandData) {
            return res.status(400).json("Brand does not exist!");
        }

        // Check if category exists in brand's categories
        if (!brandData.categories.includes(category)) {
            return res.status(400).json("Category not found in the selected brand!");
        }

        const newProduct = new Product({
            productName,
            description,
            price,
            category,
            brand,
            productImage,
            addedBy: req.userId
        });

        await newProduct.save();

        return res.status(201).json({ message: "Product created successfully", newProduct });
    } catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json(error);
    }
};

exports.editProductController = async (req, res) => {
    const { id } = req.params;
    const { productName, description, price } = req.body;
    const productImage = req.file ? req.file.filename : undefined;

    if (!productName || !description || !price || !productImage) {
        return res.status(401).json("All fields are required!")
    }

    try {
        const product = await Product.findById(id);
        if (!product) return res.status(404).json("Product not found");

        // Check ownership
        if (product.addedBy.toString() !== req.userId) {
            return res.status(403).json("You are not allowed to edit this product");
        }

        if (product.brand) {
            const brandData = await Brand.findById(product.brand);
            if (!brandData) return res.status(400).json("Brand does not exist");

            if (product.category && !brandData.categories.includes(product.category)) {
                return res.status(400).json("Category not found in the selected brand");
            }
        }

        // Update fields
        if (productName) product.productName = productName;
        if (description) product.description = description;
        if (price) product.price = price;
        if (productImage) product.productImage = productImage;

        await product.save();

        return res.status(200).json({ message: "Product updated successfully", product });
    } catch (error) {
        console.error("Error editing product:", error);
        return res.status(500).json(error);
    }
};

exports.deleteProductController = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);
        if (!product) return res.status(404).json("Product not found");

        // Check ownership
        if (product.addedBy.toString() !== req.userId) {
            return res.status(403).json("You are not allowed to delete this product");
        }

        await product.remove();

        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json(error);
    }
};

exports.getAllProductsController = async (req, res) => {
    try {
        const { brand, category, sortBy, sortOrder } = req.query;
        const userId = req.userId;

        // Get users who have blocked the logged-in user
        const blockedByUsers = await User.find({ blockedUsers: userId }).select('_id');
        const blockedByUserIds = blockedByUsers.map(user => user._id);

        // filter
        const filter = {
            ...(brand && { brand }),
            ...(category && { category }),
            addedBy: { $nin: blockedByUserIds }
        };

        let sort = {};

        if (sortBy) {
            const order = sortOrder === 'desc' ? -1 : 1;
            if (['price', 'productName'].includes(sortBy)) {
                sort[sortBy] = order;
            }
        }

        const products = await Product.find(filter)
            .populate('brand', 'brandName categories')
            .populate('addedBy', 'username email')
            .sort(sort);

        return res.status(200).json(products);

    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json(error);
    }
};

exports.getMyProductsController = async (req, res) => {
    try {
        const userId = req.userId;

        const myProducts = await Product.find({ addedBy: userId })
            .populate('brand', 'brandName categories');

        return res.status(200).json(myProducts);

    } catch (error) {
        console.error("Error fetching user products:", error);
        return res.status(500).json(error);
    }
};