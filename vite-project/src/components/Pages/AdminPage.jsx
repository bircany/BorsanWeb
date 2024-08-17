import { useEffect, useState } from 'react';
import { Table, Button, Form, Select, message } from 'antd';
import axios from 'axios';
import '../../css/AdminPage.css';

const { Option } = Select;

const roleMap = {
  1: 'Admin',
  2: 'Developer',
  3: 'User',
};

const reverseRoleMap = {
  'Admin': 1,
  'Developer': 2,
  'User': 3,
};

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();
  
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        setUsers(response.data);
      } catch (error) {
        message.error('Kullanıcıları alırken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (values) => {
    if (selectedUser) {
      try {
        const response = await axios.put(`http://localhost:5000/api/users/perm/${selectedUser.ID}`, {
          permID: reverseRoleMap[values.role]
        });
        if (response.status === 200) {
          const updatedUsers = users.map(user =>
            user.ID === selectedUser.ID ? { ...user, permID: reverseRoleMap[values.role] } : user
          );
          setUsers(updatedUsers);
          message.success('Kullanıcı rolü başarıyla güncellendi');
        }
      } catch (error) {
        message.error('Rol güncellenirken bir hata oluştu: ' + error.response?.data?.message || error.message);
      }
    } else {
      message.error('Seçili bir kullanıcı yok');
    }
  };
  

  const columns = [
    { title: 'ID', dataIndex: 'ID', key: 'ID' },
    { title: 'Ad', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Rol',
      dataIndex: 'permID',
      key: 'permID',
      render: (text, record) => (
        <Button onClick={() => {
          setSelectedUser(record);
          form.setFieldsValue({ role: roleMap[text] });
        }}>
          {roleMap[text]}
        </Button>
      ),
    },
  ];

  return (
    <div className="admin-page">
      <Table
        dataSource={users}
        columns={columns}
        loading={loading}
        rowKey="ID"
        pagination={{ pageSize: 10 }}
      />
      <Form
        form={form}
        layout="vertical"
        onFinish={handleRoleChange}
        initialValues={{ role: selectedUser ? roleMap[selectedUser.permID] : '' }}
        style={{ marginTop: 20 }}
      >
        <Form.Item name="role" label="Rol" rules={[{ required: true, message: 'Bir rol seçin' }]}>
          <Select placeholder="Rol seçin">
            <Option value="Admin">Admin</Option>
            <Option value="Developer">Developer</Option>
            <Option value="User">User</Option>
          </Select>
        </Form.Item>
        <Button type="primary" htmlType="submit" disabled={!selectedUser}>
          Rolü Güncelle
        </Button>
      </Form>
    </div>
  );
};

export default AdminPage;
