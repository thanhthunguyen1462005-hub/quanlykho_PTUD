import { useState, useEffect } from 'react';
import axios from 'axios';

export default function LoginPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        setUsers(response.data);
        console.log('Dữ liệu tài khoản từ MySQL:', response.data);
      } catch (error) {
        console.error('Lỗi kết nối Backend:', error);
      }
    };
    
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-blue-600 mb-4">Danh sách tài khoản từ Database</h1>
      {users.length === 0 ? <p>Đang tải dữ liệu...</p> : (
        <ul className="list-disc pl-5">
          {users.map((user) => (
            <li key={user.id} className="mb-2">
              <strong>{user.username}</strong> - {user.full_name} 
              <span className="text-gray-500 ml-2">({user.role_key})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}