// import { useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { Modal, Button, Input, Form, message } from 'antd';
import axios from 'axios';


const AddProductPopup = ({ visible, onClose, onAddProduct }) => {
    const [form] = Form.useForm();
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            console.log('Form values:', values); // Form verilerini yazdırın
    
            const product = { ...values,};
    
            await axios.post('http://localhost:5000/api/products', product);
            onAddProduct();
            form.resetFields();
            onClose();
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message); // Hata mesajını yazdırın
            message.error('Ürün eklenirken bir hata oluştu.');
        }
    };
    

    return (
        <Modal
            title="Ürün Ekle"
            visible={visible}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    İptal
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit}>
                    Ürünü Ekle
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">
                <Form.Item label="Ürün Adı" name="productName" rules={[{ required: true, message: 'Ürün adı girin' }]}>
                    <Input placeholder="Ürün Adı" />
                </Form.Item>
                <Form.Item label="Kablo Sayısı" name="numberOfWires" rules={[{ required: true, message: 'Kablo sayısı girin' }]}>
                    <Input type="number" placeholder="Kablo Sayısı" />
                </Form.Item>
                <Form.Item label="Tel Çapları" name="wireDiameters">
                    <Input placeholder="Tel Çapları" />
                </Form.Item>
                <Form.Item label="Nominal Kesit" name="nominalSection">
                    <Input placeholder="Nominal Kesit" />
                </Form.Item>
                <Form.Item label="Yaklaşık Kablo Dış Çapı" name="approxCableOutDiameter">
                    <Input placeholder="Yaklaşık Kablo Dış Çapı" />
                </Form.Item>
                <Form.Item label="Hava Üzerindeki Akım Taşıma Kapasitesi" name="currentCarryCapacityOnAir">
                    <Input placeholder="Hava Üzerindeki Akım Taşıma Kapasitesi" />
                </Form.Item>
                <Form.Item label="Toprak Üzerindeki Akım Taşıma Kapasitesi" name="currentCarryCapacityOnSoil">
                    <Input placeholder="Toprak Üzerindeki Akım Taşıma Kapasitesi" />
                </Form.Item>
                <Form.Item label="İletken DC Direnci Sıcaklığı" name="conductorDCResistanceTemp">
                    <Input placeholder="İletken DC Direnci Sıcaklığı" />
                </Form.Item>
                <Form.Item label="Çift Sayısı" name="numberOfPairs">
                    <Input placeholder="Çift Sayısı" />
                </Form.Item>
                <Form.Item label="İletken Kesiti" name="conductorCrossSection">
                    <Input placeholder="İletken Kesiti" />
                </Form.Item>
                <Form.Item label="İzolasyon Direnci" name="insulationResistance">
                    <Input placeholder="İzolasyon Direnci" />
                </Form.Item>
                <Form.Item label="Etkin Kapasite" name="effectiveCapacity">
                    <Input placeholder="Etkin Kapasite" />
                </Form.Item>
                <Form.Item label="Empedans" name="impedance">
                    <Input placeholder="Empedans" />
                </Form.Item>
                <Form.Item label="Endüktans" name="enductance">
                    <Input placeholder="Endüktans" />
                </Form.Item>
                <Form.Item label="Çalışma Voltajı" name="operatingVoltage">
                    <Input placeholder="Çalışma Voltajı" />
                </Form.Item>
                <Form.Item label="Test Voltajı" name="testVoltage">
                    <Input placeholder="Test Voltajı" />
                </Form.Item>
                <Form.Item label="İletken Direnci" name="conductorResistance">
                    <Input placeholder="İletken Direnci" />
                </Form.Item>
                <Form.Item label="Devre Bütünlüğü Testi" name="circuitIntegrityTest">
                    <Input placeholder="Devre Bütünlüğü Testi" />
                </Form.Item>
                <Form.Item label="Bükülme Yarıçapı" name="bendingRadius">
                    <Input placeholder="Bükülme Yarıçapı" />
                </Form.Item>
                <Form.Item label="Çalışma Sıcaklığı" name="operatingTemp">
                    <Input placeholder="Çalışma Sıcaklığı" />
                </Form.Item>
                <Form.Item label="Duman Yoğunluğu" name="smokeDensityTense">
                    <Input placeholder="Duman Yoğunluğu" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

// Define prop types
AddProductPopup.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onAddProduct: PropTypes.func.isRequired,
};

export default AddProductPopup;
