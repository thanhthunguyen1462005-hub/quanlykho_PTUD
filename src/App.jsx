import React, { useState } from 'react';
import LoginPage from './LoginPage';
import DashboardLayout from './DashboardLayout';
import HomePage from './HomePage';
import InventoryApprovalPage from './InventoryApprovalPage';

export default function App() {
  const [user, setUser] = useState(null); 
  const [currentTab, setCurrentTab] = useState('home');

  if (!user) {
    return <LoginPage onLoginSuccess={(userData) => {
      setUser(userData);
      setCurrentTab(userData.defaultTab || 'home');
    }} />;
  }

  return (
    <DashboardLayout 
      activeTab={currentTab} 
      onTabChange={setCurrentTab}
      onLogout={() => setUser(null)}
      currentUser={user} // Truyền thông tin user hiện tại sang Layout để phân quyền hiển thị
    >
      {currentTab === 'home' && <HomePage currentUser={user} />}
      {currentTab === 'approval' && (
        // Kiểm tra bảo mật: Nếu không phải Ban Giám Đốc mà cố tình vào link/tab này sẽ bị chặn
        user.roleKey === 'director' || user.name === 'Ban Giám Đốc' ? (
          <InventoryApprovalPage />
        ) : (
          <div className="p-8 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center">
            <h3 className="text-lg font-bold mb-1">Truy cập bị từ chối (403 Forbidden)</h3>
            <p className="text-sm">Tài khoản <strong>{user.name}</strong> không có quyền truy cập chức năng "Phê duyệt biên bản kiểm kê". Chỉ Ban Giám Đốc mới có quyền này!</p>
          </div>
        )
      )}
      {currentTab === 'request' && <div className="text-gray-500 p-6 bg-white rounded-xl border shadow-sm">Màn hình Phiếu yêu cầu / Mua hàng / Kế hoạch / QA-QC...</div>}
      {currentTab === 'warehouse' && <div className="text-gray-500 p-6 bg-white rounded-xl border shadow-sm">Màn hình Quản lý kho & Nhập xuất...</div>}
      {currentTab === 'users' && <div className="text-gray-500 p-6 bg-white rounded-xl border shadow-sm">Màn hình Quản trị tài khoản & Phân quyền...</div>}
    </DashboardLayout>
  );
}