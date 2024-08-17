import { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { Modal, Button, Input, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import '../../css/ProductList.css';
import AddProductPopup from './AddProductPopup';

const ProductListingPage = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [updatedProduct, setUpdatedProduct] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    // Fetch products from the API
    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // Export products to an Excel file
    const handleExport = () => {
        const ws = XLSX.utils.json_to_sheet(products);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Products');
        XLSX.writeFile(wb, 'products.xlsx');
    };

    // Handle search input change
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    // Handle product editing
    const handleEdit = (product) => {
        setEditingProduct(product);
        setUpdatedProduct(product);
        setIsEditModalVisible(true);
    };

    // Update product details
    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:5000/api/products/${editingProduct.ID}`, updatedProduct);
            fetchProducts(); 
            setIsEditModalVisible(false);
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    // Delete a product
    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/products/${editingProduct.ID}`);
            fetchProducts(); 
            setIsEditModalVisible(false);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    // Open modal
    const showModal = () => {
        setIsModalVisible(true);
    };

    // Close modal
    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    // Load products on component mount
    useEffect(() => {
        fetchProducts();
    }, []);

    // Filter products based on search term
    const filteredProducts = products.filter(product =>
        Object.values(product).some(value =>
            value !== null && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="product-listing-page">
            <div className="controls">
                <Button className="export-button" onClick={handleExport}>Dışa Aktar</Button>
                <Input
                    type="text"
                    placeholder="Ara..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-input"
                />
                <Button
                    icon={<PlusOutlined />}
                    className="add-button"
                    onClick={showModal}
                >
                    Ürün Ekle
                </Button>
            </div>

            <table className="product-table">
                <thead>
                    <tr>
                        {/* Table headers */}
                        <th>ID</th>
                        <th>Ürün Adı</th>
                        <th>Kablo Sayısı</th>
                        <th>Tel Çapları</th>
                        <th>Nominal Kesit</th>
                        <th>Yaklaşık Kablo Dış Çapı</th>
                        <th>Hava Üzerindeki Akım Taşıma Kapasitesi</th>
                        <th>Toprak Üzerindeki Akım Taşıma Kapasitesi</th>
                        <th>İletken DC Direnci Sıcaklık</th>
                        <th>Çift Sayısı</th>
                        <th>İletken Kesit</th>
                        <th>İzolasyon Direnci</th>
                        <th>Etkin Kapasite</th>
                        <th>Empedans</th>
                        <th>Endüktans</th>
                        <th>Çalışma Voltajı</th>
                        <th>Test Voltajı</th>
                        <th>İletken Direnci</th>
                        <th>Devre Bütünlüğü Testi</th>
                        <th>Bükülme Yarıçapı</th>
                        <th>Çalışma Sıcaklığı</th>
                        <th>Duman Yoğunluğu Testi</th>
                        <th>Ürün Eklenme Tarihi</th>
                        <th>İşlemler</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map((product) => (
                        <tr key={product.ID}>
                            <td>{product.ID}</td>
                            <td>{product.productName}</td>
                            <td>{product.numberOfWires}</td>
                            <td>{product.wireDiameters}</td>
                            <td>{product.nominalSection}</td>
                            <td>{product.approxCableOutDiameter}</td>
                            <td>{product.currentCarryCapacityOnAir}</td>
                            <td>{product.currentCarryCapacityOnSoil}</td>
                            <td>{product.conductorDCResistanceTemp}</td>
                            <td>{product.numberOfPairs}</td>
                            <td>{product.conductorCrossSection}</td>
                            <td>{product.insulationResistance}</td>
                            <td>{product.effectiveCapacity}</td>
                            <td>{product.impedance}</td>
                            <td>{product.enductance}</td>
                            <td>{product.operatingVoltage}</td>
                            <td>{product.testVoltage}</td>
                            <td>{product.conductorResistance}</td>
                            <td>{product.circuitIntegrityTest}</td>
                            <td>{product.bendingRadius}</td>
                            <td>{product.operatingTemp}</td>
                            <td>{product.smokeDensityTense}</td>
                            <td>{product.createDate}</td>
                            <td>
                                <Button className="edit-button" onClick={() => handleEdit(product)}>Düzenle</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Add Product Popup */}
            <AddProductPopup
                visible={isModalVisible}
                onClose={handleModalCancel}
                onAddProduct={() => {
                    fetchProducts(); // Refresh the product list
                    handleModalCancel();
                }}
            />

            {/* Edit Product Modal */}
            <Modal
                title="Ürünü Düzenle"
                open={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                footer={[
                    <Button key="delete" onClick={handleDelete} danger>
                        Sil
                    </Button>,
                    <Button key="update" type="primary" onClick={handleUpdate}>
                        Güncelle
                    </Button>,
                    <Button key="cancel" onClick={() => setIsEditModalVisible(false)}>
                        İptal
                    </Button>,
                ]}
            >
                <Form layout="vertical">
                    {/* Form items for editing product */}
                    <Form.Item label="Ürün Adı:">
                        <Input
                            type="text"
                            placeholder="Ürün Adı"
                            value={updatedProduct.productName || ''}
                            onChange={(e) => setUpdatedProduct({ ...updatedProduct, productName: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Kablo Sayısı:">
                        <Input
                            type="number"
                            placeholder="Kablo Sayısı"
                            value={updatedProduct.numberOfWires || ''}
                            onChange={(e) => setUpdatedProduct({ ...updatedProduct, numberOfWires: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Tel Çapları:">
                        <Input
                            type="text"
                            placeholder="Tel Çapları"
                            value={updatedProduct.wireDiameters || ''}
                            onChange={(e) => setUpdatedProduct({ ...updatedProduct, wireDiameters: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Nominal Kesit:">
                        <Input
                            type="text"
                            placeholder="Nominal Kesit"
                            value={updatedProduct.nominalSection || ''}
                            onChange={(e) => setUpdatedProduct({ ...updatedProduct, nominalSection: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Yaklaşık Kablo Dış Çapı:">
                        <Input
                            type="text"
                            placeholder="Yaklaşık Kablo Dış Çapı"
                            value={updatedProduct.approxCableOutDiameter || ''}
                            onChange={(e) => setUpdatedProduct({ ...updatedProduct, approxCableOutDiameter: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Hava Üzerindeki Akım Taşıma Kapasitesi:">
                        <Input
                            type="text"
                            placeholder="Hava Üzerindeki Akım Taşıma Kapasitesi"
                            value={updatedProduct.currentCarryCapacityOnAir || ''}
                            onChange={(e) => setUpdatedProduct({ ...updatedProduct, currentCarryCapacityOnAir: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Toprak Üzerindeki Akım Taşıma Kapasitesi:">
                        <Input
                            type="text"
                            placeholder="Toprak Üzerindeki Akım Taşıma Kapasitesi"
                            value={updatedProduct.currentCarryCapacityOnSoil || ''}
                            onChange={(e) => setUpdatedProduct({ ...updatedProduct, currentCarryCapacityOnSoil: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="İletken DC Direnci Sıcaklık:">
                        <Input
                            type="text"
                            placeholder="İletken DC Direnci Sıcaklık"
                            value={updatedProduct.conductorDCResistanceTemp || ''}
                            onChange={(e) => setUpdatedProduct({ ...updatedProduct, conductorDCResistanceTemp: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Çift Sayısı:">
                        <Input
                            type="number"
                            placeholder="Çift Sayısı"
                            value={updatedProduct.numberOfPairs || ''}
                            onChange={(e) => setUpdatedProduct({ ...updatedProduct, numberOfPairs: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="İletken Kesit:">
                        <Input
                            type="text"
                            placeholder="İletken Kesit"
                            value={updatedProduct.conductorCrossSection || ''}
                            onChange={(e) => setUpdatedProduct({ ...updatedProduct, conductorCrossSection: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="İzolasyon Direnci:">
                        <Input
                            type="text"
                            placeholder="İzolasyon Direnci"
                            value={updatedProduct.insulationResistance || ''}
                            onChange={(e) => setUpdatedProduct({ ...updatedProduct, insulationResistance: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Etkin Kapasite:">
                        <Input
                            type="text"
                            placeholder="Etkin Kapasite"
                            value={updatedProduct.effectiveCapacity || ''}
                            onChange={(e) => setUpdatedProduct({ ...updatedProduct, effectiveCapacity: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Empedans:">
                        <Input
                            type="text"
                            placeholder="Empedans"
                            value={updatedProduct.impedance || ''}
                            onChange={(e) => setUpdatedProduct({ ...updatedProduct, impedance: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Endüktans:">
                        <Input
                            type="text"
                            placeholder="Endüktans"
                            value={updatedProduct.enductance || ''}
                            onChange={(e) => setUpdatedProduct({ ...updatedProduct, enductance: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Çalışma Voltajı:">
                        <Input
                            type="text"
                            placeholder="Çalışma Voltajı"
                            value={updatedProduct.operatingVoltage || ''}
                            onChange={(e) => setUpdatedProduct({ ...updatedProduct, operatingVoltage: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Test Voltajı:">
                        <Input
                            type="text"
                            placeholder="Test Voltajı"
                            value={updatedProduct.testVoltage || ''}
                            onChange={(e) => setUpdatedProduct({ ...updatedProduct, testVoltage: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="İletken Direnci:">
                        <Input
                            type="text"
                            placeholder="İletken Direnci"
                            value={updatedProduct.conductorResistance || ''}
                            onChange={(e) => setUpdatedProduct({ ...updatedProduct, conductorResistance: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Devre Bütünlüğü Testi:">
                        <Input
                            type="text"
                            placeholder="Devre Bütünlüğü Testi"
                            value={updatedProduct.circuitIntegrityTest || ''}
                            onChange={(e) => setUpdatedProduct({ ...updatedProduct, circuitIntegrityTest: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Bükülme Yarıçapı:">
                        <Input
                            type="text"
                            placeholder="Bükülme Yarıçapı"
                            value={updatedProduct.bendingRadius || ''}
                            onChange={(e) => setUpdatedProduct({ ...updatedProduct, bendingRadius: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Çalışma Sıcaklığı:">
                        <Input
                            type="text"
                            placeholder="Çalışma Sıcaklığı"
                            value={updatedProduct.operatingTemp || ''}
                            onChange={(e) => setUpdatedProduct({ ...updatedProduct, operatingTemp: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Duman Yoğunluğu Testi:">
                        <Input
                            type="text"
                            placeholder="Duman Yoğunluğu Testi"
                            value={updatedProduct.smokeDensityTense || ''}
                            onChange={(e) => setUpdatedProduct({ ...updatedProduct, smokeDensityTense: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Ürün Eklenme Tarihi:">
                        <Input
                            type="text"
                            placeholder="Ürün Eklenme Tarihi"
                            value={updatedProduct.createDate || ''}
                            onChange={(e) => setUpdatedProduct({ ...updatedProduct, createDate: e.target.value })}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ProductListingPage;
