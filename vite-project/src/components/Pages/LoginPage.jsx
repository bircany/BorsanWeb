import { useState } from 'react';
import { Form, Input, Button, message } from 'antd'; 
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../../css/Loginpage.css';
import { loginUser } from '../../services/apiClient';

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
    
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const userDetails = await loginUser(values);
      message.success('Giriş Başarılı!');
      onLogin(userDetails);
  
      localStorage.setItem('user', JSON.stringify(userDetails));
      console.log('User details saved to localStorage:', userDetails);
  
      navigate('/');
    } catch (error) {
      const errorMessage = error.message || 'Giriş başarısız!';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Form
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <div className="logo">
          <img 
            src="https://www.borsan.com.tr/wp-content/uploads/2018/02/borsan-logo-2.png" 
            alt="Borsan Logo" 
            style={{ marginLeft: 10, marginBottom: 10, width: '150px', height: 'auto' }}
          />
        </div>
        <Form.Item
        name="username"
        rules={[{ required: true, message: 'Kullanıcı Adını Giriniz!' }]}
      >
        <Input placeholder="Kullanıcı Adı" style={{ height: '40px' }} />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Şifrenizi Giriniz!' }]}
      >
        <Input type="password" placeholder="Şifre" style={{ height: '40px' }} />
      </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-button" loading={loading}>Giriş Yap</Button>
        </Form.Item>
        <div className="login-footer">
          <Link to="/register" className="login-link">Kayıt Ol</Link>
          <Link to="/faq" className="login-link">SSS</Link>
        </div>
      </Form>
    </div>
  );
};

LoginPage.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default LoginPage;
