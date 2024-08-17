import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Space } from 'antd';
import Slider from 'react-slick';
import ProductCard from './ProductCard'; // Import the ProductCard component
import '../css/App.css'; // Import additional styles if necessary

const { Title } = Typography;
const ProductLists = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '0',
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched products:', data);
        setProducts(data.slice(0, 4)); // Adjust as needed
      })
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleViewAll = () => {
    navigate('/list-products');
  };

  return (
    <div className="carousel-container">
      <Space align="center" justify="space-between" style={{ marginBottom: '20px' }}>
        <Title level={3} strong className="primary--color">En Çok Satılan Ürünler</Title>
        <Button type="link" className="gray--color" onClick={handleViewAll}>Hepsini Gör</Button>
      </Space>
      <Slider {...settings} className="carousel-slider">
        {products.map((product) => (
          <ProductCard
            key={product.ID}
            imageUrl={`http://localhost:5000/uploads/${product.imageUrl}`} // Full URL
            code={product.code || 'No Code'} // Pass the code if available
            productName={product.productName || 'Adı Yok'}
            details={product} // Pass the details
          />
        ))}
      </Slider>
    </div>
  );
};

export default ProductLists;
