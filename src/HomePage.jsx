import React from 'react';
import { PackageSearch, TrendingUp, AlertCircle, Clock, ArrowUpRight, Sparkles } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass, trend, isPositive }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-50 to-transparent rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform"></div>
    <div className="relative z-10 flex justify-between items-start">
      <div>
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-extrabold text-gray-900 mt-2 tracking-tight">{value}</h3>
      </div>
      <div className={`p-3.5 rounded-2xl ${colorClass} shadow-sm`}>
        <Icon size={26} />
      </div>
    </div>
    <div className="mt-4 flex items-center gap-2 text-sm">
      <span className={`inline-flex items-center font-bold px-2 py-0.5 rounded-full text-xs ${
        isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
      }`}>
        <ArrowUpRight size={14} className="mr-0.5" /> {trend}
      </span>
      <span className="text-gray-400 font-medium">so với tháng trước</span>
    </div>
  </div>
);

export default function HomePage({ currentUser }) {
  const recentActivities = [
    { id: 'PNK-0102', action: 'Nhập kho', item: 'Phôi chai PET 500ml', time: '10 phút trước', status: 'Hoàn thành' },
    { id: 'PNK-0103', action: 'Nhập kho', item: 'Si-rô cô đặc Coca-Cola', time: '25 phút trước', status: 'Hoàn thành' },
    { id: 'PXK-0089', action: 'Xuất kho', item: 'Thùng Coca-Cola lon 330ml', time: '1 giờ trước', status: 'Đang xử lý' },
    { id: 'QA-0045', action: 'Kiểm định', item: 'Nắp chai nhôm định hình', time: '2 giờ trước', status: 'Không đạt' },
    { id: 'PYC-0210', action: 'Yêu cầu xuất', item: 'Thùng Coca-Cola chai PET 1.5L', time: '3 giờ trước', status: 'Chờ duyệt' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Banner chào mừng tự động đổi tên theo người đăng nhập */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-blue-950 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-xs font-semibold tracking-wide uppercase border border-red-500/30 mb-1">
            <Sparkles size={13} /> Smart Factory WMS 6.0 - Coca-Cola
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Xin chào, {currentUser?.name || 'Thành viên'}!</h1>
          <p className="text-gray-300 text-sm">Hệ thống quản lý chuỗi 5 kho nguyên liệu và 5 kho thành phẩm nhà máy.</p>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-400">Tài khoản đăng nhập</p>
            <p className="text-sm font-semibold text-blue-300">@{currentUser?.username || 'user'}</p>
          </div>
        </div>
      </div>

      {/* Thẻ thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Tổng nguyên liệu tồn" value="54,230 kg" icon={PackageSearch} colorClass="bg-blue-50 text-blue-600" trend="+12%" isPositive={true} />
        <StatCard title="Thành phẩm tồn kho" value="28,450 két" icon={TrendingUp} colorClass="bg-emerald-50 text-emerald-600" trend="+8%" isPositive={true} />
        <StatCard title="Phiếu chờ duyệt" value="14 phiếu" icon={Clock} colorClass="bg-amber-50 text-amber-600" trend="-2%" isPositive={false} />
        <StatCard title="Cảnh báo cận hạn" value="2 lô hàng" icon={AlertCircle} colorClass="bg-rose-50 text-rose-600" trend="-1 lô" isPositive={true} />
      </div>

      {/* Bảng nhật ký */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Nhật ký hoạt động nhà máy Coca-Cola</h3>
            <p className="text-xs text-gray-500 mt-0.5">Các giao dịch nhập, xuất, kiểm định và yêu cầu mới nhất trong hệ thống</p>
          </div>
          <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors">
            Xem tất cả
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-400 text-xs uppercase tracking-wider font-semibold border-b border-gray-100">
                <th className="px-6 py-4">Mã giao dịch</th>
                <th className="px-6 py-4">Loại hoạt động</th>
                <th className="px-6 py-4">Mặt hàng liên quan</th>
                <th className="px-6 py-4">Thời gian</th>
                <th className="px-6 py-4">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 font-medium">
              {recentActivities.map((row, index) => (
                <tr key={index} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4 text-gray-900 font-bold group-hover:text-blue-600 transition-colors">
                    {row.id}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold">
                      {row.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-800">{row.item}</td>
                  <td className="px-6 py-4 text-gray-400 text-xs">{row.time}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-2xs ${
                      row.status === 'Hoàn thành' ? 'bg-emerald-100/80 text-emerald-700 border border-emerald-200/50' :
                      row.status === 'Đang xử lý' ? 'bg-blue-100/80 text-blue-700 border border-blue-200/50' :
                      row.status === 'Chờ duyệt' ? 'bg-amber-100/80 text-amber-700 border border-amber-200/50' :
                      'bg-rose-100/80 text-rose-700 border border-rose-200/50'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}