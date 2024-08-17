import { useState } from 'react';
import { Card, Modal, Button } from 'antd';
import PropTypes from 'prop-types';
import '../css/ProductCard.css'; // Import CSS

const { Meta } = Card;

const ProductCard = ({ imageUrl, id, productName, details }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const exportToPDF = () => {
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF();
  
      // Title
      doc.setFontSize(18);
      doc.text('Product Details', 10, 10);
  
      // Product Image
      if (imageUrl) {
        doc.addImage(imageUrl, 'PNG', 50, 20, 50, 60); // Adjust dimensions and position as needed
      }
  
      // Product Information
      doc.setFontSize(14);
      doc.text(`Product Name: ${productName}`, 10, 100);
  
      const detailsList = [
        { label: 'Number of Wires', value: details.numberOfWires },
        { label: 'Wire Diameters', value: details.wireDiameters },
        { label: 'Nominal Section', value: details.nominalSection },
        { label: 'Approximate Cable Outer Diameter', value: details.approxCableOutDiameter },
        { label: 'Current Carrying Capacity in Air', value: details.currentCarryCapacityOnAir },
        { label: 'Current Carrying Capacity in Soil', value: details.currentCarryCapacityOnSoil },
        { label: 'Conductor DC Resistance Temperature', value: details.conductorDCResistanceTemp },
        { label: 'Number of Pairs', value: details.numberOfPairs },
        { label: 'Conductor Cross Section', value: details.conductorCrossSection },
        { label: 'Insulation Resistance', value: details.insulationResistance },
        { label: 'Effective Capacity', value: details.effectiveCapacity },
        { label: 'Impedance', value: details.impedance },
        { label: 'Inductance', value: details.enductance },
        { label: 'Operating Voltage', value: details.operatingVoltage },
        { label: 'Test Voltage', value: details.testVoltage },
        { label: 'Conductor Resistance', value: details.conductorResistance },
        { label: 'Circuit Integrity Test', value: details.circuitIntegrityTest },
        { label: 'Bending Radius', value: details.bendingRadius },
        { label: 'Operating Temperature', value: details.operatingTemp },
        { label: 'Smoke Density Test', value: details.smokeDensityTense },
      ];
  
      let y = 110;
      detailsList.forEach((item) => {
        doc.setFontSize(12);
        doc.text(`${item.label}: ${item.value}`, 10, y);
        y += 10;
      });
  
      doc.save('product-details.pdf');
    });
  };

  return (
    <>
      <Card
        hoverable
        cover={<img alt="product" src={imageUrl || 'default-image.png'} />} // Fallback image
        className="product-card"
        onClick={showModal}
      >
        <Meta title={productName} description={id} />
      </Card>
      <Modal
        title={productName}
        open={isModalVisible} // Updated from visible to open
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="export" type="primary" onClick={exportToPDF}>
            Export to PDF
          </Button>,
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>,
        ]}
        width={1000}
        className="product-modal"
      >
        <div className="product-modal-content">
          <img
            src={imageUrl || 'default-image.png'} // Fallback image
            alt="product"
            className="product-image"
          />
          <div className="product-details">
            <h3>Product Details</h3>
            <ul>
              <li><strong>Name:</strong> {productName}</li>
              <li><strong>Number of Wires:</strong> {details.numberOfWires}</li>
              <li><strong>Wire Diameters:</strong> {details.wireDiameters}</li>
              <li><strong>Nominal Section:</strong> {details.nominalSection}</li>
              <li><strong>Approximate Cable Outer Diameter:</strong> {details.approxCableOutDiameter}</li>
              <li><strong>Current Carrying Capacity in Air:</strong> {details.currentCarryCapacityOnAir}</li>
              <li><strong>Current Carrying Capacity in Soil:</strong> {details.currentCarryCapacityOnSoil}</li>
              <li><strong>Conductor DC Resistance Temperature:</strong> {details.conductorDCResistanceTemp}</li>
              <li><strong>Number of Pairs:</strong> {details.numberOfPairs}</li>
              <li><strong>Conductor Cross Section:</strong> {details.conductorCrossSection}</li>
              <li><strong>Insulation Resistance:</strong> {details.insulationResistance}</li>
              <li><strong>Effective Capacity:</strong> {details.effectiveCapacity}</li>
              <li><strong>Impedance:</strong> {details.impedance}</li>
              <li><strong>Inductance:</strong> {details.enductance}</li>
              <li><strong>Operating Voltage:</strong> {details.operatingVoltage}</li>
              <li><strong>Test Voltage:</strong> {details.testVoltage}</li>
              <li><strong>Conductor Resistance:</strong> {details.conductorResistance}</li>
              <li><strong>Circuit Integrity Test:</strong> {details.circuitIntegrityTest}</li>
              <li><strong>Bending Radius:</strong> {details.bendingRadius}</li>
              <li><strong>Operating Temperature:</strong> {details.operatingTemp}</li>
              <li><strong>Smoke Density Test:</strong> {details.smokeDensityTense}</li>
            </ul>
          </div>
        </div>
      </Modal>
    </>
  );
};

ProductCard.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired, // Changed from code to id
  productName: PropTypes.string.isRequired,
  details: PropTypes.object.isRequired,
};

export default ProductCard;
