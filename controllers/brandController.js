const Brand = require('../models/Brand')

exports.addBrandController = async (req, res) => {
    try {
        const { brandName, categories } = req.body
        const brandLogo = req.file ? req.file.filename : null;
        
        if (!brandName || !brandLogo || !categories || categories.length === 0) {
            return res.status(400).json("All fields are required!")
        }
        
        // Check if brand already exists
        const existingBrand = await Brand.findOne({ brandName })
        if (existingBrand) {
            return res.status(400).json("Brand already exists!")
        }
        

        const newBrand = new Brand({
            brandName,
            brandLogo,
            categories
        })

        await newBrand.save()

        return res.status(201).json({ message: "Brand created successfully", newBrand })
    } catch (error) {
        console.error("Error creating brand:", error)
        return res.status(500).json(error)
    }
}

exports.getAllBrandsController = async (req, res) => {
    try {
        const brands = await Brand.find()
        return res.status(200).json(brands)
    } catch (error) {
        console.error("Error fetching brands:", error)
        return res.status(500).json(error)
    }
}
