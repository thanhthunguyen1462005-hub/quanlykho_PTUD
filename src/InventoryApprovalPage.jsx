import React, { useState } from 'react';
import { CheckCircle2, XCircle, Eye, AlertTriangle, FileText, ArrowLeft, RefreshCcw } from 'lucide-react';

export default function InventoryApprovalPage() {
  const [auditReports, setAuditReports] = useState([
    {
      id: 'BBKK-2026-01',
      warehouse: 'Kho Nguyên liệu 01 (Khu Si-rô & Phôi chai)',
      auditor: 'Nguyễn Văn Kiểm',
      date: '2026-10-30',
      status: 'Chờ duyệt',
      items: [
        { code: 'NVL-SYRU01', name: 'Si-rô cô đặc Coca-Cola (Thùng)', bookQty: 1500, actualQty: 1480, unit: 'thùng', reason: 'Hao hụt trong quá trình bơm rót', proposal: 'Điều chỉnh giảm tồn kho' },
        { code: 'NVL-PET02', name: 'Phôi chai PET 500ml', bookQty: 25000, actualQty: 25000, unit: 'phôi', reason: 'Khớp số liệu', proposal: 'Không cần xử lý' }
      ]
    },
    {
      id: 'BBKK-2026-02',
      warehouse: 'Kho Thành phẩm 02 (Khu Đóng thùng)',
      auditor: 'Trần Thị Kiểm',
      date: '2026-10-29',
      status: 'Chờ duyệt',
      items: [
        { code: 'TP-CC330', name: 'Thùng Coca-Cola lon 330ml', bookQty: 5000, actualQty: 5040, unit: 'thùng', reason: 'Lệch do kiểm kê nhầm lốc hàng khuyến mãi', proposal: 'Điều chỉnh tăng tồn kho' }
      ]
    }
  ]);

  const [selectedReport, setSelectedReport] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [notification, setNotification] = useState(null);

  const handleApprove = () => {
    setAuditReports(auditReports.map(rep => 
      rep.id === selectedReport.id ? { ...rep, status: 'Đã duyệt' } : rep
    ));
    setShowConfirmModal(false);
    setSelectedReport(null);
    setNotification({ type: 'success', message: `Phê duyệt biên bản ${selectedReport.id} thành công! Đã cập nhật cân bằng tồn kho nhà máy.` });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleReject = (e) => {
    e.preventDefault();
    if (!rejectReason.trim()) return;
    setAuditReports(auditReports.map(rep => 
      rep.id === selectedReport.id ? { ...rep, status: 'Từ chối', rejectReason } : rep
    ));
    setShowRejectModal(false);
    setSelectedReport(null);
    setRejectReason('');
    setNotification({ type: 'error', message: `Đã từ chối biên bản. Đã gửi thông báo về cho Ban kiểm kê.` });
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Phê duyệt biên bản kiểm kê</h2>
          <p className="text-sm text-gray-500 mt-1">Xác thực kết quả kiểm kê kho nhà máy nước ngọt & cân bằng tồn kho</p>
        </div>
        <button 
          onClick={() => setSelectedReport(null)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
        >
          <RefreshCcw size={16} /> Làm mới danh sách
        </button>
      </div>

      {notification && (
        <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${
          notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
          <span>{notification.message}</span>
        </div>
      )}

      {!selectedReport ? (
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50 font-semibold text-gray-700">
            Danh sách biên bản kiểm kê kho Coca-Cola chờ Ban Giám Đốc phê duyệt
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-sm text-gray-500 bg-gray-50/50">
                <th className="px-6 py-3 font-medium">Mã biên bản</th>
                <th className="px-6 py-3 font-medium">Khu vực kho</th>
                <th className="px-6 py-3 font-medium">Người lập</th>
                <th className="px-6 py-3 font-medium">Ngày lập</th>
                <th className="px-6 py-3 font-medium">Trạng thái</th>
                <th className="px-6 py-3 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {auditReports.filter(r => r.status === 'Chờ duyệt').length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-400">Không có biên bản nào đang chờ duyệt.</td>
                </tr>
              ) : (
                auditReports.filter(r => r.status === 'Chờ duyệt').map((rep) => (
                  <tr key={rep.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900">{rep.id}</td>
                    <td className="px-6 py-4 text-gray-700">{rep.warehouse}</td>
                    <td className="px-6 py-4 text-gray-600">{rep.auditor}</td>
                    <td className="px-6 py-4 text-gray-500">{rep.date}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        {rep.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedReport(rep)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium text-xs transition-colors"
                      >
                        <Eye size={15} /> Xem chi tiết & Duyệt
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white border rounded-xl shadow-sm p-6 space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Chi tiết biên bản kiểm kê</span>
              <h3 className="text-xl font-bold text-gray-800 mt-1">{selectedReport.id} - {selectedReport.warehouse}</h3>
            </div>
            <button 
              onClick={() => setSelectedReport(null)}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 font-medium"
            >
              <ArrowLeft size={16} /> Quay lại danh sách
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg text-sm">
            <div><span className="text-gray-500">Người lập:</span> <strong className="text-gray-800">{selectedReport.auditor}</strong></div>
            <div><span className="text-gray-500">Ngày kiểm kê:</span> <strong className="text-gray-800">{selectedReport.date}</strong></div>
            <div><span className="text-gray-500">Trạng thái:</span> <span className="text-yellow-600 font-semibold">{selectedReport.status}</span></div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Danh sách sản phẩm / nguyên liệu & Chênh lệch tồn kho</h4>
            <table className="w-full text-left border rounded-lg overflow-hidden">
              <thead className="bg-gray-100 text-gray-600 text-xs uppercase font-medium">
                <tr>
                  <th className="px-4 py-3">Mã hàng</th>
                  <th className="px-4 py-3">Tên sản phẩm / Nguyên liệu</th>
                  <th className="px-4 py-3 text-center">Sổ sách</th>
                  <th className="px-4 py-3 text-center">Thực đếm</th>
                  <th className="px-4 py-3 text-center">Chênh lệch</th>
                  <th className="px-4 py-3">Nguyên nhân & Đề xuất</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {selectedReport.items.map((item, idx) => {
                  const diff = item.actualQty - item.bookQty;
                  return (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{item.code}</td>
                      <td className="px-4 py-3 text-gray-700">{item.name}</td>
                      <td className="px-4 py-3 text-center">{item.bookQty} {item.unit}</td>
                      <td className="px-4 py-3 text-center font-semibold">{item.actualQty} {item.unit}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          diff === 0 ? 'bg-gray-100 text-gray-600' :
                          diff > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {diff > 0 ? `+${diff}` : diff} {item.unit}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        <p><strong>Lý do:</strong> {item.reason}</p>
                        <p className="text-blue-600 mt-0.5"><strong>Đề xuất:</strong> {item.proposal}</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button 
              onClick={() => setShowRejectModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium text-sm transition-colors"
            >
              <XCircle size={18} /> Từ chối biên bản
            </button>
            <button 
              onClick={() => setShowConfirmModal(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm shadow-sm transition-colors"
            >
              <CheckCircle2 size={18} /> Phê duyệt & Cân bằng kho
            </button>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-blue-600">
              <FileText size={28} />
              <h3 className="text-lg font-bold text-gray-900">Xác nhận phê duyệt biên bản</h3>
            </div>
            <p className="text-sm text-gray-600">
              Bạn có chắc chắn muốn phê duyệt biên bản <strong>{selectedReport?.id}</strong>? Hệ thống sẽ tự động cập nhật lại số lượng tồn kho si-rô và thành phẩm nước ngọt theo thực tế.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleApprove}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm"
              >
                Xác nhận duyệt
              </button>
            </div>
          </div>
        </div>
      )}

      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle size={28} />
              <h3 className="text-lg font-bold text-gray-900">Lý do từ chối biên bản</h3>
            </div>
            <form onSubmit={handleReject} className="space-y-4">
              <p className="text-sm text-gray-600">
                Vui lòng nhập lý do từ chối biên bản <strong>{selectedReport?.id}</strong> để gửi phản hồi về cho Ban kiểm kê:
              </p>
              <textarea 
                required
                rows="3"
                placeholder="Nhập lý do từ chối (bắt buộc)..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              ></textarea>
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 border rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 shadow-sm"
                >
                  Gửi từ chối
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}