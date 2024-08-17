import { useState } from 'react';
import {Form, Switch, Typography } from 'antd';
import '../../css/App.css';
const { Title, Text } = Typography;

const Settings = () => {
  const [darkMode, setDarkMode] = useState(document.body.classList.contains('dark-mode'));

  const toggleDarkMode = (checked) => {
    setDarkMode(checked);
    document.body.classList.toggle('dark-mode', checked);
  };

  return (
    <div className="settings-container">
      <Title level={2}>Ayarlar</Title>
      <Form layout="vertical" className="settings-form">
          <Switch checked={darkMode} onChange={toggleDarkMode} />
          <Text type="secondary" strong>   Dark Mode</Text>
      </Form>
    </div>
  );
};

export default Settings;
