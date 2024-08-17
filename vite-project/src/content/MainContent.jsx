import { Flex } from 'antd';
import { useNavigate } from 'react-router-dom'; 
import Banner from '../components/Banner';
import ProductLists from '../components/ProductLists';
import '../css/App.css';

const MainContent = () => {
  const navigate = useNavigate(); 

  const handleDesignClick = () => {
    navigate('/design'); 
  };

  const handleAddProductClick = () => {
    navigate('/list-products', { state: { openPopup: true } }); // ProductsList sayfasına yönlendir
  };

  return (
    <div style={{ flex: 1 }}>
      <Flex vertical gap="2.3rem">
        <Banner onDesignClick={handleDesignClick} onAddProductClick={handleAddProductClick} />
        <ProductLists />
      </Flex>
    </div>
  );
};

export default MainContent;
