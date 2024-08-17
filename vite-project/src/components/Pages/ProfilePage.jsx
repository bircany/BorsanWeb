import { Button, Form, Input, Typography, message } from 'antd';
import { useState, useEffect } from 'react';
import '../../css/ProfilePage.css';
import { fetchUserProfile, updateUserProfile } from '../../services/apiClient';

const { Title } = Typography;

const ProfilePage = () => {
  const [form] = Form.useForm();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
  
    if (!user || !user.username) {
      message.error('No username found in localStorage');
      return;
    }
  
    const username = user.username;
  
    fetchUserProfile(username)
      .then(data => {
        setUserData(data);
        form.setFieldsValue({
          name: data.name,
          surname: data.surname,
          email: data.email,
          jobID: data.jobID || '',
          permID: data.permID || '',
          departmentID: data.DepartmentID || ''
        });
      })
      .catch(error => {
        console.error('Error fetching user profile:', error);
        message.error('Error fetching user profile');
      });
  }, [form]);

 

  const handleSubmit = async (values) => {
    const username = userData?.username;
    try {
      await updateUserProfile(username, values);
      message.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error('Failed to update profile');
    }
  };

  return (
    <div className="profile-page">
      <Title level={2}>Profile Page</Title>
      <Form form={form} onFinish={handleSubmit} className="profile-form">
        <Form.Item label="Name" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="Surname" name="surname">
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input />
        </Form.Item>
        <Form.Item label="Password" name="password">
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Update Profile</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProfilePage;
