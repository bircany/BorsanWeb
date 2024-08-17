import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

// Fetch departments
export const fetchDepartments = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/departments`);
    return response.data;
  } catch (error) {
    throw new Error('Departmanları almak başarısız oldu');
  }
};

// Fetch jobs by department ID
export const fetchJobsByDepartments = async (departmentId) => {
  try {
    const response = await axios.get(`${BASE_URL}/jobs`, { params: { departmentId } });
    return response.data;
  } catch (error) {
    throw new Error('İşleri almak başarısız oldu');
  }
};

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, userData, {
      headers: { 'Content-Type': 'application/json' }
    });
    if (response.status !== 201) {
      throw new Error('Kayıt başarısız oldu');
    }
    return response.data;
  } catch (error) {
    console.error('Kayıt Hatası:', error);
    throw new Error('Kayıt başarısız oldu');
  }
};

// Login user
export const loginUser = async (values) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, values, {
      headers: { 'Content-Type': 'application/json' }
    });
    const data = response.data;
    
    console.log('Giriş API Yanıtı:', data);

    if (response.status !== 200) throw new Error(data.message || 'Giriş başarısız oldu');

    return {
      username: data.user.username,
      permID: data.user.permID,
      name: data.user.name,
      surname: data.user.surname,
      createDate: data.user.createDate,
      password: data.user.password,
      jobID: data.user.jobID,
      email: data.user.email,
      dbo: data.user.dbo,
      DepartmentID: data.user.DepartmentID,
    };
  } catch (error) {
    console.error('Giriş Hatası:', error);
    throw new Error(error.message || 'Giriş başarısız oldu');
  }
};

export const updateUserProfile = async (username, userData) => {
  try {
    const response = await axios.put(`${BASE_URL}/users/${username}`, userData, {
      headers: { 'Content-Type': 'application/json' }
    });
    if (response.status !== 200) {
      throw new Error('Profil güncelleme başarısız oldu');
    }
    return response.data;
  } catch (error) {
    console.error('Profil Güncelleme Hatası:', error);
    throw new Error('Profil güncelleme başarısız oldu');
  }
};

export const fetchUserProfile = async (username) => {
  try {
    console.log(`Kullanıcı profili alınıyor: ${username}`);
    const response = await axios.get(`${BASE_URL}/users/${username}`);
    console.log('Kullanıcı Profil API Yanıtı:', response.data);
    
    if (response.status !== 200) {
      throw new Error('Profil bilgileri alınamadı');
    }
    return response.data;
  } catch (error) {
    console.error('API Hatası:', error);
    throw new Error(error.response?.data?.message || 'Profil bilgileri alınamadı');
  }
};

export const getUserPermission = async (username) => {
  try {
    const response = await axios.get(`${BASE_URL}/auth/verify-permission/${username}`);
    if (response.status !== 200) {
      throw new Error('İzinler alınamadı');
    }
    return response.data.permID;
  } catch (error) {
    console.error('API Hatası:', error);
    throw new Error('İzinler alınamadı');
  }
};


