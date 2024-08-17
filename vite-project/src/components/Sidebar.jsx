// src/components/Sidebar.jsx
import { Menu, notification } from 'antd'; 
import { UserOutlined, LogoutOutlined, CarryOutOutlined, AntDesignOutlined, UnorderedListOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom'; // useLocation import edildi
import PropTypes from 'prop-types'; 
import '../css/Sidebar.css';
import { getUserPermission } from '../services/apiClient'; // Import API function

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Mevcut yolu almak için useLocation kullanıldı
  const user = JSON.parse(localStorage.getItem('user'));

  const handleMenuClick = async (e) => {
    const { key } = e;
    
    if (key === '/logout') {
      onLogout();
      notification.info({
        message: 'Çıkış Yapıldı',
        description: 'Başarıyla çıkış yaptınız.',
        placement: 'topRight',
        duration: 2,
      });
      navigate('/login'); 
    } else if (key === '/admin') {
      if (user) {
        try {
          const permission = await getUserPermission(user.username);
          if (permission === 1) {
            navigate(key);
          } else {
            notification.error({
              message: 'Yetkiniz Yetersiz',
              description: 'Admin sayfasına erişim yetkiniz yok.',
              placement: 'topRight',
              duration: 2,
            });
          }
        } catch (error) {
          console.error('Error fetching permission:', error);
        }
      }
    } else {
      navigate(key);
    }
  };

  // Static menu items
  const menuItems = [
    { key: '/', icon: <UserOutlined />, label: 'Anasayfa' },
    { key: '/design', icon: <AntDesignOutlined />, label: 'Tasarım' },
    { key: '/tasks', icon: <CarryOutOutlined />, label: 'Görevler' },
    { key: '/list-products', icon: <UnorderedListOutlined />, label: 'Ürünler' },
    { key: '/admin', icon: <UserOutlined />, label: 'Admin' },
    { key: '/settings', icon: <SettingOutlined />, label: 'Ayarlar' }, 
    { key: '/logout', icon: <LogoutOutlined />, label: 'Çıkış' }
  ];

  return (
    <>
      <div className="logo-container">
        <img 
          src="https://www.borsan.com.tr/wp-content/uploads/2018/02/borsan-logo-2.png" 
          alt="Borsan Logo" 
          className="logo"
        />
      </div>
      <Menu 
        mode="inline" 
        selectedKeys={[location.pathname]} // Aktif sayfayı seçili olarak ayarlar
        className="menu-bar"
        onClick={handleMenuClick}
        items={menuItems}
      />
    </>
  );
};

Sidebar.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default Sidebar;
