// src/components/Header.jsx
import { Avatar, Typography, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import NotificationButton from './NotificationButton'; 
import '../css/Header.css';
import PropTypes from 'prop-types'; 

const CustomHeader = ({ user }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <Space
      direction="horizontal"
      align="center"
      style={{ width: '100%', justifyContent: 'space-between' }}
    >
      <Typography.Title level={4} type="secondary">
        <strong><i>Hoşgeldiniz, {user ? `${user.name} ${user.surname}` : 'undefined'}</i></strong>
      </Typography.Title>
      <Space align="center" style={{ gap: '3rem' }}>
        <Space align="center" style={{ gap: '10px' }}>
          <NotificationButton />
          <Avatar
            icon={<UserOutlined />}
            onClick={handleProfileClick}
            style={{ cursor: 'pointer' }}
          />
        </Space>
      </Space>
    </Space>
  );
};

CustomHeader.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    surname: PropTypes.string
  })
};

export default CustomHeader;
