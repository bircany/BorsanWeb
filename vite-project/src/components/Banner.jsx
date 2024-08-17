import { Button, Card, Space, Typography } from 'antd';
import PropTypes from 'prop-types'; // PropTypes import edildi
import '../css/App.css';

const Banner = ({ onDesignClick, onAddProductClick }) => {
  return (
    <Card style={{ height: "260px", padding: '20px' }}>
      <Space direction="vertical" size="large">
        <Space direction="vertical" align="start">
          <Typography.Title level={3} strong>Tasarla ve Kullan</Typography.Title>
          <Typography.Text type="secondary" strong>
            Ürün Tasarımınızı Yapın ve Bunu Kolayca Ürün Pörtföyünüze Ekleyin.
          </Typography.Text>
        </Space>
        <Space size="large">
          <Button type="primary" size="large" onClick={onDesignClick}>Tasarım Yap!</Button>
          <Button size="large" onClick={onAddProductClick}>Ürün Ekle!</Button>
        </Space>
      </Space>
    </Card>
  );
};

Banner.propTypes = {
  onDesignClick: PropTypes.func.isRequired,
  onAddProductClick: PropTypes.func.isRequired,
};

export default Banner;
