import React from 'react';
import { 
  LayoutDashboard, Package, FileText, AlertTriangle, Users, 
  LogOut, Bell, User, CheckSquare, ClipboardList, Search, 
  BarChart3, Shield, FileCheck, ShoppingCart 
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, text, active, onClick }) => (
  <li 
    onClick={onClick}
    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
      active ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium text-sm">{text}</span>
  </li>
);

export default function DashboardLayout({ children, activeTab, onTabChange, onLogout, currentUser }) {
  const roleKey = currentUser?.roleKey || 'director';

  // Cấu hình menu phân quyền tuyệt đối cho từng Actor theo đúng sơ đồ Use Case và Báo cáo nhóm
  const menuConfig = {
    // 1. Ban Giám Đốc (Nguyễn Thanh Thư)
    director: [
      { id: 'home', text: 'Trang chủ Dashboard', icon: LayoutDashboard },
      { id: 'report', text: 'Thống kê báo cáo quản trị', icon: BarChart3 },
      { id: 'approval', text: 'Phê duyệt biên bản kiểm kê', icon: AlertTriangle },
      { id: 'audit_log', text: 'Tra cứu nhật ký hệ thống', icon: Shield },
    ],
    
    // 2. Bộ phận Lập kế hoạch (Trần Thị Yến Vi)
    planning: [
      { id: 'home', text: 'Trang chủ', icon: LayoutDashboard },
      { id: 'check_inventory', text: 'Tra cứu số lượng tồn kho', icon: Search },
      { id: 'production_plan', text: 'Lập kế hoạch sản xuất', icon: ClipboardList },
      { id: 'track_request', text: 'Theo dõi trạng thái phiếu', icon: FileText },
    ],

    // 3. Bộ phận QA/QC (Dương Thanh Thủy)
    qa: [
      { id: 'home', text: 'Trang chủ', icon: LayoutDashboard },
      { id: 'qc_inspection', text: 'Lập biên bản kiểm định QC', icon: CheckSquare },
      { id: 'qa_lookup', text: 'Tra cứu biên bản QA/QC', icon: Search },
    ],

    // 4. Bộ phận Mua hàng (Dương Thanh Thủy phụ trách thêm)
    purchase: [
      { id: 'home', text: 'Trang chủ', icon: LayoutDashboard },
      { id: 'purchase_req', text: 'Lập yêu cầu nhập nguyên liệu', icon: ShoppingCart },
      { id: 'check_inventory', text: 'Tra cứu số lượng tồn kho', icon: Search },
    ],

    // 5. Bộ phận Xưởng (Nguyễn Thành Nghĩa)
    workshop: [
      { id: 'home', text: 'Trang chủ', icon: LayoutDashboard },
      { id: 'track_req_workshop', text: 'Theo dõi trạng thái phiếu', icon: FileText },
      { id: 'request_material', text: 'Lập phiếu nhận nguyên liệu', icon: Package },
      { id: 'search_goods', text: 'Tìm kiếm hàng hóa', icon: Search },
      { id: 'request_finished', text: 'Lập yêu cầu nhập thành phẩm', icon: FileCheck },
    ],

    // 6. Nhân viên / Quản lý kho & Ban kiểm kê (Đồng Thị Anh Thư)
    warehouse: [
      { id: 'home', text: 'Trang chủ', icon: LayoutDashboard },
      { id: 'create_import_slip', text: 'Lập phiếu nhập kho', icon: Package },
      { id: 'search_import_export', text: 'Tra cứu phiếu nhập xuất', icon: Search },
      { id: 'inventory_report', text: 'Báo cáo kiểm kê', icon: BarChart3 },
    ],

    // 7. Ban Kiểm kê (Riêng biệt)
    audit: [
      { id: 'home', text: 'Trang chủ', icon: LayoutDashboard },
      { id: 'audit_record', text: 'Lập biên bản ghi nhận kiểm kê', icon: FileText },
      { id: 'search_import_export', text: 'Tra cứu phiếu nhập xuất', icon: Search },
    ],

    // 8. Quản trị hệ thống (System Admin)
    admin: [
      { id: 'home', text: 'Trang chủ', icon: LayoutDashboard },
      { id: 'users', text: 'Quản lý tài khoản & Phân quyền', icon: Users },
      { id: 'audit_log', text: 'Tra cứu nhật ký hệ thống', icon: Shield },
    ]
  };

  const currentMenus = menuConfig[roleKey] || menuConfig.director;

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-xl">
        <div className="p-5 border-b border-gray-800">
          <h1 className="text-xl font-bold tracking-wider text-red-500">WMS SIX STAR</h1>
          <p className="text-xs text-gray-400 mt-0.5">Vai trò: <span className="text-blue-400 font-semibold">{currentUser?.name}</span></p>
        </div>
        
        <ul className="flex-1 p-4 space-y-2 overflow-y-auto">
          {currentMenus.map((menu) => (
            <SidebarItem 
              key={menu.id}
              icon={menu.icon} 
              text={menu.text} 
              active={activeTab === menu.id} 
              onClick={() => onTabChange(menu.id)} 
            />
          ))}
        </ul>

        <div className="p-4 border-t border-gray-800">
          <SidebarItem icon={LogOut} text="Đăng xuất" onClick={onLogout} />
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-xs">
          <h2 className="text-xl font-semibold text-gray-800">Hệ thống Quản lý Kho Nhà máy Nước ngọt Coca-Cola</h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 cursor-pointer bg-gray-50 px-3 py-1.5 rounded-full border">
              <div className="w-7 h-7 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-xs">
                {currentUser?.name?.[0] || 'U'}
              </div>
              <span className="text-sm font-medium text-gray-700">{currentUser?.name}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          {children}
        </main>
      </div>
    </div>
  );
}