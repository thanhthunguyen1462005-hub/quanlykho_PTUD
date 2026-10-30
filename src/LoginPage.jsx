import React, { useState } from 'react';
import { Lock, User, ShieldCheck } from 'lucide-react';

export default function LoginPage({ onLoginSuccess }) {
  const [role, setRole] = useState('director'); 
  const [username, setUsername] = useState('bgd_admin');
  const [password, setPassword] = useState('123456');

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'director') { setUsername('bgd_admin'); }
    else if (selectedRole === 'warehouse') { setUsername('thukho_01'); }
    else if (selectedRole === 'qa') { setUsername('qa_inspector'); }
    else if (selectedRole === 'purchase') { setUsername('muahang_01'); }
    else if (selectedRole === 'planning') { setUsername('lapkehoach_01'); }
    else if (selectedRole === 'workshop') { setUsername('xuong_01'); }
    else if (selectedRole === 'audit') { setUsername('bankiemke_01'); }
    else if (selectedRole === 'admin') { setUsername('sys_admin'); }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const roleNames = {
      director: { name: 'Ban Giám Đốc', defaultTab: 'home', roleKey: 'director' },
      warehouse: { name: 'Nhân viên / Quản lý kho', defaultTab: 'warehouse', roleKey: 'warehouse' },
      qa: { name: 'Bộ phận QA/QC', defaultTab: 'request', roleKey: 'qa' },
      purchase: { name: 'Bộ phận Mua hàng', defaultTab: 'request', roleKey: 'purchase' },
      planning: { name: 'Bộ phận Kế hoạch sản xuất', defaultTab: 'request', roleKey: 'planning' },
      workshop: { name: 'Bộ phận Xưởng', defaultTab: 'request', roleKey: 'workshop' },
      audit: { name: 'Ban Kiểm kê', defaultTab: 'approval', roleKey: 'audit' },
      admin: { name: 'Quản trị hệ thống', defaultTab: 'users', roleKey: 'admin' }
    };
    onLoginSuccess({ username, ...roleNames[role] });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl mx-auto flex items-center justify-center font-bold text-2xl shadow-inner">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">WMS SIX STAR</h2>
          <p className="text-sm text-gray-500">Cổng đăng nhập phân quyền hệ thống nhà máy</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chọn vai trò phòng ban / actor</label>
            <select 
              value={role} 
              onChange={(e) => handleRoleChange(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl bg-white text-sm font-medium text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="director">Ban Giám Đốc (Leader)</option>
              <option value="warehouse">Nhân viên / Quản lý kho</option>
              <option value="qa">Bộ phận QA/QC</option>
              <option value="purchase">Bộ phận Mua hàng</option>
              <option value="planning">Bộ phận Kế hoạch sản xuất</option>
              <option value="workshop">Bộ phận Xưởng</option>
              <option value="audit">Ban Kiểm kê</option>
              <option value="admin">Quản trị hệ thống (System Admin)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><User size={18} /></span>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm bg-gray-50"
                readOnly
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><Lock size={18} /></span>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-md transition-colors text-sm"
          >
            Đăng nhập vào hệ thống
          </button>
        </form>

        <div className="text-center text-xs text-gray-400 pt-2 border-t">
          Hệ thống Quản lý Kho Nhà máy Thông minh WMS
        </div>
      </div>
    </div>
  );
}