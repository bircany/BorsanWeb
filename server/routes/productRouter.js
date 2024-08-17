import express from 'express';
import sql from 'mssql';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import { dbConfig } from '../dbConfig.js';

const router = express.Router();

const validateProductData = (data) => {
    const requiredFields = [
        'ID', 'productName', 'numberOfWires', 'wireDiameters',
        'nominalSection', 'approxCableOutDiameter', 'currentCarryCapacityOnAir',
        'currentCarryCapacityOnSoil', 'conductorDCResistanceTemp', 'numberOfPairs',
        'conductorCrossSection', 'insulationResistance', 'effectiveCapacity',
        'impedance', 'enductance', 'operatingVoltage', 'testVoltage',
        'conductorResistance', 'circuitIntegrityTest', 'bendingRadius',
        'operatingTemp', 'smokeDensityTense'
    ];
    return requiredFields.every(field => data[field] !== undefined && data[field] !== null && data[field] !== '');
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadDir = join(__dirname, '../uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

router.post('/', upload.single('imageUrl'), async (req, res) => {
    const newProduct = req.body;

    if (!validateProductData(newProduct)) {
        return res.status(400).json({ message: 'Invalid product data' });
    }

    let imageUrl = null;
    if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
    }

    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input('ID', sql.Int, newProduct.ID)
            .input('productName', sql.VarChar, newProduct.productName)
            .input('numberOfWires', sql.Int, newProduct.numberOfWires)
            .input('wireDiameters', sql.Int, newProduct.wireDiameters)
            .input('nominalSection', sql.Int, newProduct.nominalSection)
            .input('approxCableOutDiameter', sql.Int, newProduct.approxCableOutDiameter)
            .input('currentCarryCapacityOnAir', sql.Int, newProduct.currentCarryCapacityOnAir)
            .input('currentCarryCapacityOnSoil', sql.Int, newProduct.currentCarryCapacityOnSoil)
            .input('conductorDCResistanceTemp', sql.Int, newProduct.conductorDCResistanceTemp)
            .input('numberOfPairs', sql.Int, newProduct.numberOfPairs)
            .input('conductorCrossSection', sql.Int, newProduct.conductorCrossSection)
            .input('insulationResistance', sql.Int, newProduct.insulationResistance)
            .input('effectiveCapacity', sql.Int, newProduct.effectiveCapacity)
            .input('impedance', sql.Int, newProduct.impedance)
            .input('enductance', sql.Int, newProduct.enductance)
            .input('operatingVoltage', sql.Int, newProduct.operatingVoltage)
            .input('testVoltage', sql.Int, newProduct.testVoltage)
            .input('conductorResistance', sql.Int, newProduct.conductorResistance)
            .input('circuitIntegrityTest', sql.Int, newProduct.circuitIntegrityTest)
            .input('bendingRadius', sql.Int, newProduct.bendingRadius)
            .input('operatingTemp', sql.Int, newProduct.operatingTemp)
            .input('smokeDensityTense', sql.Int, newProduct.smokeDensityTense)
            .input('imageUrl', sql.VarChar, imageUrl)
            .query(`
                INSERT INTO Products (
                    ID, productName, numberOfWires, wireDiameters, nominalSection,
                    approxCableOutDiameter, currentCarryCapacityOnAir, currentCarryCapacityOnSoil,
                    conductorDCResistanceTemp, numberOfPairs, conductorCrossSection, insulationResistance,
                    effectiveCapacity, impedance, enductance, operatingVoltage, testVoltage,
                    conductorResistance, circuitIntegrityTest, bendingRadius, operatingTemp, smokeDensityTense, imageUrl
                ) VALUES (
                    @ID, @productName, @numberOfWires, @wireDiameters, @nominalSection,
                    @approxCableOutDiameter, @currentCarryCapacityOnAir, @currentCarryCapacityOnSoil,
                    @conductorDCResistanceTemp, @numberOfPairs, @conductorCrossSection, @insulationResistance,
                    @effectiveCapacity, @impedance, @enductance, @operatingVoltage, @testVoltage,
                    @conductorResistance, @circuitIntegrityTest, @bendingRadius, @operatingTemp, @smokeDensityTense, @imageUrl
                )
            `);

        res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
        console.error('Database insertion error:', error);
        res.status(500).json({ message: 'Failed to add product' });
    }
});

// Fetch all products
router.get('/', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query('SELECT * FROM Products');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching products:', err.message);
        res.status(500).json({ message: 'Error fetching products', error: err.message });
    }
});

// Delete a product by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Products WHERE ID = @id');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error('Error deleting product:', err.message);
        res.status(500).json({ message: 'Error deleting product', error: err.message });
    }
});

// Update a product by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const productData = req.body;

    if (!validateProductData(productData)) {
        return res.status(400).json({ message: 'Invalid product data' });
    }

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('id', sql.Int, productData.ID)
            .input('productName', sql.VarChar, productData.productName)
            .input('numberOfWires', sql.Int, productData.numberOfWires)
            .input('wireDiameters', sql.Int, productData.wireDiameters)
            .input('nominalSection', sql.Int, productData.nominalSection)
            .input('approxCableOutDiameter', sql.Int, productData.approxCableOutDiameter)
            .input('currentCarryCapacityOnAir', sql.Int, productData.currentCarryCapacityOnAir)
            .input('currentCarryCapacityOnSoil', sql.Int, productData.currentCarryCapacityOnSoil)
            .input('conductorDCResistanceTemp', sql.Int, productData.conductorDCResistanceTemp)
            .input('numberOfPairs', sql.Int, productData.numberOfPairs)
            .input('conductorCrossSection', sql.Int, productData.conductorCrossSection)
            .input('insulationResistance', sql.Int, productData.insulationResistance)
            .input('effectiveCapacity', sql.Int, productData.effectiveCapacity)
            .input('impedance', sql.Int, productData.impedance)
            .input('enductance', sql.Int, productData.enductance)
            .input('operatingVoltage', sql.Int, productData.operatingVoltage)
            .input('testVoltage', sql.Int, productData.testVoltage)
            .input('conductorResistance', sql.Int, productData.conductorResistance)
            .input('circuitIntegrityTest', sql.Int, productData.circuitIntegrityTest)
            .input('bendingRadius', sql.Int, productData.bendingRadius)
            .input('operatingTemp', sql.Int, productData.operatingTemp)
            .input('smokeDensityTense', sql.Int, productData.smokeDensityTense)
            .query(`
                UPDATE Products SET
                    productName = @productName,
                    numberOfWires = @numberOfWires,
                    wireDiameters = @wireDiameters,
                    nominalSection = @nominalSection,
                    approxCableOutDiameter = @approxCableOutDiameter,
                    currentCarryCapacityOnAir = @currentCarryCapacityOnAir,
                    currentCarryCapacityOnSoil = @currentCarryCapacityOnSoil,
                    conductorDCResistanceTemp = @conductorDCResistanceTemp,
                    numberOfPairs = @numberOfPairs,
                    conductorCrossSection = @conductorCrossSection,
                    insulationResistance = @insulationResistance,
                    effectiveCapacity = @effectiveCapacity,
                    impedance = @impedance,
                    enductance = @enductance,
                    operatingVoltage = @operatingVoltage,
                    testVoltage = @testVoltage,
                    conductorResistance = @conductorResistance,
                    circuitIntegrityTest = @circuitIntegrityTest,
                    bendingRadius = @bendingRadius,
                    operatingTemp = @operatingTemp,
                    smokeDensityTense = @smokeDensityTense
                WHERE ID = @id
            `);

        res.status(200).json({ message: 'Product updated successfully' });
    } catch (err) {
        console.error('Error updating product:', err.message);
        res.status(500).json({ message: 'Error updating product', error: err.message });
    }
});

export default router;
