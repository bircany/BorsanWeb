import { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, Select, message } from 'antd'; 
import { Link, useNavigate } from 'react-router-dom';
import { registerUser as registerUserApi, fetchDepartments, fetchJobsByDepartments } from "../../services/apiClient.js";
import '../../css/RegisterPage.css'; 

const { Option } = Select;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const departmentsData = await fetchDepartments();
        setDepartments(departmentsData);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const loadJobs = async () => {
      if (selectedDepartment) {
        try {
          const jobsData = await fetchJobsByDepartments(selectedDepartment);
          setJobs(jobsData);
        } catch (error) {
          console.error('Error fetching jobs:', error);
        }
      } else {
        setJobs([]);
      }
    };

    loadJobs();
  }, [selectedDepartment]);

  const handleDepartmentChange = (value) => {
    setSelectedDepartment(value);
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (values.password !== values.confirmPassword) {
        message.error('Şifreler eşleşmiyor!');
        return;
      }
  
      const createDate = new Date().toLocaleString();
      await registerUserApi({ ...values, createDate });
      message.success('Kayıt başarılı!');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Kayıt başarısız!';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="register-container">
      <Form
        className="register-form"
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
          name="name"
          rules={[{ required: true, message: 'Adınızı Giriniz!' }]}
        >
          <Input placeholder="Ad" />
        </Form.Item>
        <Form.Item
          name="surname"
          rules={[{ required: true, message: 'Soyadınızı Giriniz!' }]}
        >
          <Input placeholder="Soyad" />
        </Form.Item>

        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Kullanıcı Adını Giriniz!' }]}
        >
          <Input placeholder="Kullanıcı Adı" />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[{ required: true, type: 'email', message: 'Geçerli bir e-posta giriniz!' }]}
        >
          <Input placeholder="E-mail" />
        </Form.Item>
        <Form.Item
          name="dbo"
          rules={[{ required: true, message: 'Doğum Tarihinizi Seçiniz!' }]}
        >
          <DatePicker placeholder="Doğum Tarihi" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="department"
          rules={[{ required: true, message: 'Departmanınızı Seçiniz!' }]}
        >
          <Select placeholder="Departmanınızı Seçin" onChange={handleDepartmentChange}>
            {departments.length > 0 ? (
              departments.map(dept => (
                dept.ID ? <Option key={dept.ID} value={dept.ID}>{dept.DepartmentName}</Option> : null
              ))
            ) : (
              <Option disabled>Departman Yok</Option>
            )}
          </Select>
        </Form.Item>
        <Form.Item
          name="job"
          rules={[{ required: true, message: 'Mesleğinizi Seçiniz!' }]}
        >
          <Select placeholder="İşinizi Seçin">
            {jobs.length > 0 ? (
              jobs.map(job => (
                job.ID ? <Option key={job.ID} value={job.ID}>{job.JobName}</Option> : null
              ))
            ) : (
              <Option disabled>İş Yok</Option>
            )}
          </Select>
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Şifrenizi Giriniz!' }]}
        >
          <Input.Password placeholder="Şifre" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          rules={[{ required: true, message: 'Şifrenizi Onaylayınız!' }]}
        >
          <Input.Password placeholder="Şifreyi Onayla" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="register-button" loading={loading}>Kayıt Ol</Button>
        </Form.Item>
        <div className="register-footer">
          <Link to="/login" className="register-link">Giriş Yap</Link>
        </div>
      </Form>
    </div>
  );
};

export default RegisterPage;
 