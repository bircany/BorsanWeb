import { useEffect, useState } from 'react';
import axios from 'axios';
import { message } from 'antd';  // Hata mesajları için import
import '../../css/Tasks.css';

// Örnek fetchUserProfile fonksiyonu
const fetchUserProfile = async (username) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/users/${username}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching user profile');
  }
};

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    Topic: '',
    Description: '',
    AssignedToUserID: '',
    AssignedByUserID: '',
    Status: '0',
    CompletedDate: ''
  });
  const [showAddTask, setShowAddTask] = useState(false);
  const [loggedInUserID, setLoggedInUserID] = useState(null);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
  
    if (user && user.username) {
      const username = user.username;
  
      fetchUserProfile(username)
        .then(data => {
          setLoggedInUserID(data.ID); // loggedInUserID'yi güncelle
          // Kullanıcı verilerini güncelle
          // Burada kullanıcı verilerini de set edebilirsiniz
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching user profile:', error);
          message.error('Error fetching user profile');
          setLoading(false);
          setError(error.message);
        });
    } else {
      message.error('No user found in localStorage');
      setLoading(false);
    }

    // Fetch tasks and users data
    const fetchData = async () => {
      try {
        const tasksResponse = await axios.get('http://localhost:5000/api/tasks');
        setTasks(tasksResponse.data);
        const usersResponse = await axios.get('http://localhost:5000/api/users');
        setUsers(usersResponse.data);
      } catch (error) {
        console.error('Error fetching tasks or users:', error);
        message.error('Error fetching tasks or users');
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = (task) => {
    setEditingTask(task);
    setFormData({
      Topic: task.Topic,
      Description: task.Description,
      AssignedToUserID: task.AssignedToUserID,
      AssignedByUserID: task.AssignedByUserID || loggedInUserID, // Kullanıcı ID'sini buradan al
      Status: task.Status.toString(),
      CompletedDate: task.CompletedDate ? new Date(task.CompletedDate).toISOString().slice(0, 10) : ''
    });
  };
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    if (loggedInUserID === null) {
      console.error('Kullanıcı ID belirlenmemiş.');
      return;
    }
  
    const dataToUpdate = { 
      ...formData, 
      AssignedByUserID: formData.AssignedByUserID || loggedInUserID, // Varsayılan değer
      CompletedDate: formData.CompletedDate || null 
    };
  
    try {
      await axios.put(`http://localhost:5000/api/tasks/${editingTask.ID}`, dataToUpdate);
      const response = await axios.get('http://localhost:5000/api/tasks');
      setTasks(response.data);
      setEditingTask(null);
    } catch (error) {
      console.error('Görev güncellenirken bir hata oluştu:', error.response ? error.response.data : error.message);
      message.error('Görev güncellenirken bir hata oluştu.');
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddTaskSubmit = async (e) => {
    e.preventDefault();

    if (loggedInUserID === null) {
      console.error('Kullanıcı ID belirlenmemiş.');
      return;
    }

    if (!formData.Topic || !formData.Description || !formData.AssignedToUserID) {
      console.error('Eksik veya hatalı form verileri:', formData);
      return;
    }

    const status = formData.Status === '1';
    const completedDate = formData.CompletedDate || null;

    const dataToSend = { 
      Topic: formData.Topic, 
      Description: formData.Description, 
      AssignedToUserID: formData.AssignedToUserID, 
      AssignedByUserID: loggedInUserID, 
      Status: status,
      CompletedDate: completedDate,
      AssignedDate: new Date().toISOString() 
    };

    try {
      await axios.post('http://localhost:5000/api/tasks', dataToSend);
      const updatedTasks = await axios.get('http://localhost:5000/api/tasks');
      setTasks(updatedTasks.data);
      setShowAddTask(false);
    
      setFormData({
        Topic: '',
        Description: '',
        AssignedToUserID: '',
        AssignedByUserID: loggedInUserID,
        Status: '0',
        CompletedDate: ''
      });
    } catch (error) {
      console.error('Görev eklenirken bir hata oluştu:', error.response ? error.response.data : error.message);
      message.error('Görev eklenirken bir hata oluştu.');
    }
  };

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p>{error}</p>;

  const getUserNameById = (userId) => {
    const user = users.find(user => user.ID === userId);
    return user ? user.name : 'Belirtilmemiş';
  };

  return (
    <div className="task-page">
      <h1>Görev Listesi</h1>
      <button className="add-task-button" onClick={() => setShowAddTask(true)}>Görev Ekle</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Başlık</th>
            <th>Açıklama</th>
            <th>Atanan Kişi</th>
            <th>Atayan Kişi</th>
            <th>Atanma Tarihi</th>
            <th>Durum</th>
            <th>Tamamlanma Tarihi</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.ID}>
              <td>{task.ID}</td>
              <td>{task.Topic}</td>
              <td>{task.Description}</td>
              <td>{getUserNameById(task.AssignedToUserID)}</td>
              <td>{getUserNameById(task.AssignedByUserID)}</td>
              <td>{new Date(task.AssignedDate).toLocaleString()}</td>
              <td>{task.Status ? 'Tamamlandı' : 'Beklemede'}</td>
              <td>{task.CompletedDate ? new Date(task.CompletedDate).toLocaleString() : 'Henüz tamamlanmadı'}</td>
              <td><button className="edit-button" onClick={() => handleEditClick(task)}>Düzenle</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingTask && (
        <div className="edit-form">
          <h2>Görevi Düzenle</h2>
          <form onSubmit={handleFormSubmit}>
            <label>
              Başlık:
              <input type="text" name="Topic" value={formData.Topic} onChange={handleFormChange} required />
            </label>
            <label>
              Açıklama:
              <input type="text" name="Description" value={formData.Description} onChange={handleFormChange} required />
            </label>
            <label>
              Atanan Kişi:
              <select name="AssignedToUserID" value={formData.AssignedToUserID} onChange={handleFormChange} required>
                <option value="">Seçiniz</option>
                {users.map(user => (
                  <option key={user.ID} value={user.ID}>{user.name}</option>
                ))}
              </select>
            </label>
            <label>
              Atayan Kişi:
              <select name="AssignedByUserID" value={formData.AssignedByUserID} onChange={handleFormChange} required>
                <option value="">Seçiniz</option>
                {users.map(user => (
                  <option key={user.ID} value={user.ID}>{user.name}</option>
                ))}
              </select>
            </label>
            <label>
              Durum:
              <select name="Status" value={formData.Status} onChange={handleFormChange} required>
                <option value="0">Beklemede</option>
                <option value="1">Tamamlandı</option>
              </select>
            </label>
            <label>
              Tamamlanma Tarihi:
              <input type="date" name="CompletedDate" value={formData.CompletedDate} onChange={handleFormChange} />
            </label>
            <button type="submit">Kaydet</button>
            <button type="button" onClick={() => setEditingTask(null)}>İptal</button>
          </form>
        </div>
      )}

      {showAddTask && (
        <div className="add-task-popup">
          <h2>Yeni Görev Ekle</h2>
          <form onSubmit={handleAddTaskSubmit}>
            <label>
              Başlık:
              <input type="text" name="Topic" value={formData.Topic} onChange={handleFormChange} required />
            </label>
            <label>
              Açıklama:
              <input type="text" name="Description" value={formData.Description} onChange={handleFormChange} required />
            </label>
            <label>
              Atanan Kişi:
              <select name="AssignedToUserID" value={formData.AssignedToUserID} onChange={handleFormChange} required>
                <option value="">Seçiniz</option>
                {users.map(user => (
                  <option key={user.ID} value={user.ID}>{user.name}</option>
                ))}
              </select>
            </label>
            <button type="submit">Ekle</button>
            <button type="button" onClick={() => setShowAddTask(false)}>İptal</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TaskPage;
