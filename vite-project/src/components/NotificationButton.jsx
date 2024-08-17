import { useState, useEffect } from 'react';
import { Badge, Button, notification } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import '../css/NotificationButton.css';

const NotificationButton = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/notifications')
  .then(response => response.text()) // Yanıtı text olarak al
  .then(text => {
    return JSON.parse(text); // JSON'a dönüştür
  })
  .then(data => setNotifications(data))
  .catch(error => console.error('Error fetching notifications:', error));

  }, []);

  const handleNotificationClick = () => {
    notifications.forEach(notificationItem => {
      notification.open({
        message: 'Yeni Bildirim',
        description: notificationItem.Message,
        className: 'custom-notification',
        onClick: () => {
          console.log('Notification Clicked!');
        },
      });
    });
  };

  return (
    <Badge count={notifications.length} className="notification-badge">
      <Button
        type="text"
        icon={<BellOutlined />}
        onClick={handleNotificationClick}
        className="notification-button"
      />
    </Badge>
  );
};

export default NotificationButton;
