import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Layout } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Mainpage from './components/Pages/Mainpage';
import Design from './components/Pages/DesignPage';
import Sidebar from './components/Sidebar'; 
import CustomHeader from './components/Header';
import Settings from './components/Pages/SettingsPage';
import AddProduct from './components/Pages/AddProductPopup';
import Tasks from './components/Pages/TasksPage'; 
import LoginPage from './components/Pages/LoginPage';
import RegisterPage from './components/Pages/RegisterPage';
import FaqPage from './components/Pages/FaqPage';
import ProfilePage from './components/Pages/ProfilePage';
import ProductListingPage from './components/Pages/ProductListingPage';
import AdminPage from './components/Pages/AdminPage';
import './css/App.css'; 
import "../node_modules/slick-carousel/slick/slick.css";
import '../node_modules/slick-carousel/slick/slick-theme.css';
import { getUserPermission } from "./services/apiClient";

const { Header, Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [permID, setPermID] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('isLoggedIn'));
    const userDetails = JSON.parse(localStorage.getItem('user'));

    if (storedData && userDetails) {
      setIsLoggedIn(true);
      setUser(userDetails);
      getUserPermission(userDetails.username)
        .then(permission => setPermID(permission))
        .catch(error => console.error('Error fetching permission:', error));
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const toggleCollapse = () => setCollapsed(!collapsed);

  const handleLogin = (userDetails) => {
    setIsLoggedIn(true);
    setUser(userDetails);
    localStorage.setItem('isLoggedIn', JSON.stringify(true));
    localStorage.setItem('user', JSON.stringify(userDetails));
    getUserPermission(userDetails.username)
      .then(permission => setPermID(permission))
      .catch(error => console.error('Error fetching permission:', error));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    localStorage.removeItem('savedDesign'); // Kayıtlı tasarımı temizle
    setPermID(null);
  };

  // AdminRoute bileşeni
  const AdminRoute = ({ element }) => {
    return permID === 1 ? element : <Navigate to="/" replace />;
  };

  AdminRoute.propTypes = {
    element: PropTypes.element.isRequired
  };

  return (
    <Router>
      <Layout>
        {isLoggedIn ? (
          <>
            <Sider 
              theme="light"
              trigger={null}
              collapsible
              collapsed={collapsed}
              className="sider"
            >
              <Sidebar onLogout={handleLogout} /> 
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={toggleCollapse}
                className="trigger-btn"
              />
            </Sider>

            <Layout>
              <Header className="header">
                <CustomHeader user={user} />
              </Header>
              <Content className="content">
                <Routes>
                  <Route path="/" element={<Mainpage />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/add-product" element={<AddProduct />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/design" element={<Design />} />
                  <Route path="/faq" element={<FaqPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/list-products" element={<ProductListingPage />} />
                  <Route path="/admin" element={<AdminRoute element={<AdminPage />} />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Content>
            </Layout>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="*" element={<Navigate to="/login" />} /> 
          </Routes>
        )}
      </Layout>
    </Router>
  );
};

export default App;
