
import React, { useState } from 'react';
import LoginPage from './LoginPage';
import DashboardLayout from './DashboardLayout';
import HomePage from './HomePage';
import InventoryApprovalPage from './InventoryApprovalPage';
import QCInspectionPage, { QCLookupPage } from './QCInspectionPage';

// Lấy danh sách biên bản QA/QC đã lưu
function loadQCRecords() {
  try {
    const saved = localStorage.getItem('sixstar_qaqc_records_v1');
    const data = saved ? JSON.parse(saved) : [];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Lỗi đọc dữ liệu QA/QC:', error);
    return [];
  }
}

export default function App() {
  const [user, setUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('home');
  const [qcRecords, setQcRecords] = useState(loadQCRecords);

  // Xử lý đăng nhập
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setCurrentTab(userData.defaultTab || 'home');
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    setUser(null);
    setCurrentTab('home');
  };

  // Hiển thị trang đăng nhập
  if (!user) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Phân quyền
  const isQAQC = user.roleKey === 'qa';

  const isDirector =
    user.roleKey === 'director' ||
    user.name === 'Ban Giám Đốc';

  return (
    <DashboardLayout
      activeTab={currentTab}
      onTabChange={setCurrentTab}
      onLogout={handleLogout}
      currentUser={user}
    >
      {/* TRANG CHỦ */}
      {currentTab === 'home' && (
        <HomePage currentUser={user} />
      )}

      {/* QA/QC - LẬP BIÊN BẢN KIỂM ĐỊNH CHẤT LƯỢNG */}
      {currentTab === 'qc_inspection' && (
        isQAQC ? (
          <QCInspectionPage
            currentUser={user}
            records={qcRecords}
            setRecords={setQcRecords}
          />
        ) : (
          <div className="p-8 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center">
            <h3 className="text-lg font-bold mb-1">
              Truy cập bị từ chối (403 Forbidden)
            </h3>
            <p className="text-sm">
              Chỉ Bộ phận QA/QC mới có quyền lập biên bản kiểm định chất lượng.
            </p>
          </div>
        )
      )}

      {/* QA/QC - TRA CỨU BIÊN BẢN */}
      {currentTab === 'qa_lookup' && (
        isQAQC ? (
          <QCLookupPage records={qcRecords} />
        ) : (
          <div className="p-8 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center">
            Bạn không có quyền tra cứu biên bản QA/QC.
          </div>
        )
      )}

      {/* BAN GIÁM ĐỐC - PHÊ DUYỆT BIÊN BẢN KIỂM KÊ */}
      {currentTab === 'approval' && (
        isDirector ? (
          <InventoryApprovalPage />
        ) : (
          <div className="p-8 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center">
            <h3 className="text-lg font-bold mb-1">
              Truy cập bị từ chối (403 Forbidden)
            </h3>
            <p className="text-sm">
              Tài khoản <strong>{user.name}</strong> không có quyền
              truy cập chức năng "Phê duyệt biên bản kiểm kê".
              Chỉ Ban Giám Đốc mới có quyền này!
            </p>
          </div>
        )
      )}

      {/* PHIẾU YÊU CẦU / MUA HÀNG / KẾ HOẠCH */}
      {currentTab === 'request' && (
        <div className="text-gray-500 p-6 bg-white rounded-xl border shadow-sm">
          Màn hình Phiếu yêu cầu / Mua hàng / Kế hoạch / QA-QC...
        </div>
      )}

      {/* QUẢN LÝ KHO */}
      {currentTab === 'warehouse' && (
        <div className="text-gray-500 p-6 bg-white rounded-xl border shadow-sm">
          Màn hình Quản lý kho & Nhập xuất...
        </div>
      )}

      {/* QUẢN TRỊ TÀI KHOẢN VÀ PHÂN QUYỀN */}
      {currentTab === 'users' && (
        <div className="text-gray-500 p-6 bg-white rounded-xl border shadow-sm">
          Màn hình Quản trị tài khoản & Phân quyền...
        </div>
      )}
    </DashboardLayout>
  );
}
