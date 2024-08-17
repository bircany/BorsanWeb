import { Row, Col } from 'antd';
import MainContent from '../../content/MainContent';
import '../../css/App.css';
const Mainpage = () => {
  return (
    <div className="mainpage-content">
      <Row gutter={16}>
        <Col span={24}>
          <MainContent />
        </Col>
      </Row>
    </div>
  );
};

export default Mainpage;
