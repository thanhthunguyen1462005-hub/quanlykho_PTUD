
import React, { useState } from 'react';
import {
    Package,
    ClipboardList,
    Clock,
    CheckCircle,
    AlertCircle,
    Search,
    Eye,
    Send,
    Factory
} from 'lucide-react';

const initialReceipts = [
    {
        maPhieu: 'PNL001',
        maKeHoach: 'KH001',
        ngayNhan: '2026-11-01',
        sanPham: 'Coca-Cola lon 330ml',
        trangThai: 'Chờ tiếp nhận',
        ghiChuKeHoach: 'Nguyên liệu phục vụ sản xuất Coca-Cola.',
        nguyenLieu: [
            {
                maHang: 'NL001',
                tenHang: 'Nước tinh khiết',
                donVi: 'Lít',
                soLuong: 1000
            },
            {
                maHang: 'NL002',
                tenHang: 'Đường',
                donVi: 'Kg',
                soLuong: 100
            },
            {
                maHang: 'NL003',
                tenHang: 'CO2',
                donVi: 'Kg',
                soLuong: 20
            },
            {
                maHang: 'NL004',
                tenHang: 'Hương liệu Coca-Cola',
                donVi: 'Lít',
                soLuong: 5
            }
        ],
        ghiChuXuong: ''
    },
    {
        maPhieu: 'PNL002',
        maKeHoach: 'KH002',
        ngayNhan: '2026-11-06',
        sanPham: 'Coca-Cola lon 330ml',
        trangThai: 'Chờ tiếp nhận',
        ghiChuKeHoach: 'Chuẩn bị nguyên liệu cho đợt sản xuất tiếp theo.',
        nguyenLieu: [
            {
                maHang: 'NL001',
                tenHang: 'Nước tinh khiết',
                donVi: 'Lít',
                soLuong: 1500
            },
            {
                maHang: 'NL002',
                tenHang: 'Đường',
                donVi: 'Kg',
                soLuong: 150
            },
            {
                maHang: 'NL003',
                tenHang: 'CO2',
                donVi: 'Kg',
                soLuong: 30
            },
            {
                maHang: 'NL004',
                tenHang: 'Hương liệu Coca-Cola',
                donVi: 'Lít',
                soLuong: 7
            }
        ],
        ghiChuXuong: ''
    }
];

export default function MaterialRequestPage({ currentUser }) {
    const [receipts, setReceipts] = useState(initialReceipts);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [result, setResult] = useState('Đã nhận đủ');
    const [note, setNote] = useState('');

    const filteredReceipts = receipts.filter((receipt) =>
        receipt.maPhieu.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.maKeHoach.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const waitingCount = receipts.filter(
        (item) => item.trangThai === 'Chờ tiếp nhận'
    ).length;

    const completedCount = receipts.filter(
        (item) => item.trangThai === 'Đã nhận đủ'
    ).length;

    const adjustmentCount = receipts.filter(
        (item) => item.trangThai === 'Cần xử lý'
    ).length;

    const openReceipt = (receipt) => {
        setSelectedReceipt(receipt);
        setResult('Đã nhận đủ');
        setNote(receipt.ghiChuXuong || '');
    };

    const closeReceipt = () => {
        setSelectedReceipt(null);
        setResult('Đã nhận đủ');
        setNote('');
    };

    const handleSubmit = () => {
        if (!selectedReceipt) return;

        if (result === 'Cần xử lý' && !note.trim()) {
            alert('Vui lòng nhập lý do cần xử lý!');
            return;
        }

        const confirmed = window.confirm(
            `Bạn có chắc chắn muốn gửi phản hồi cho phiếu ${selectedReceipt.maPhieu}?`
        );

        if (!confirmed) return;

        setReceipts((prev) =>
            prev.map((receipt) =>
                receipt.maPhieu === selectedReceipt.maPhieu
                    ? {
                        ...receipt,
                        trangThai: result,
                        ghiChuXuong: note.trim()
                    }
                    : receipt
            )
        );

        alert('Gửi phản hồi tiếp nhận nguyên liệu thành công!');
        closeReceipt();
    };

    const getStatusClass = (status) => {
        if (status === 'Đã nhận đủ') {
            return 'bg-green-100 text-green-700';
        }

        if (status === 'Cần xử lý') {
            return 'bg-red-100 text-red-700';
        }

        return 'bg-yellow-100 text-yellow-700';
    };

    return (
        <div className="p-6 space-y-6">

            {/* TIÊU ĐỀ */}
            <div>
                <div className="flex items-center gap-3">
                    <Factory size={30} className="text-blue-600" />
                    <h1 className="text-2xl font-bold text-gray-800">
                        Lập phiếu nhận nguyên liệu
                    </h1>
                </div>

                <p className="text-gray-500 mt-2">
                    Tiếp nhận và kiểm tra nguyên liệu phục vụ sản xuất Coca-Cola.
                </p>
            </div>

            {/* THỐNG KÊ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                <div className="bg-white border rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <ClipboardList className="text-blue-600" size={28} />
                        <div>
                            <p className="text-sm text-gray-500">Tổng phiếu</p>
                            <p className="text-2xl font-bold">{receipts.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <Clock className="text-yellow-600" size={28} />
                        <div>
                            <p className="text-sm text-gray-500">Chờ tiếp nhận</p>
                            <p className="text-2xl font-bold">{waitingCount}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="text-green-600" size={28} />
                        <div>
                            <p className="text-sm text-gray-500">Đã nhận đủ</p>
                            <p className="text-2xl font-bold">{completedCount}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="text-red-600" size={28} />
                        <div>
                            <p className="text-sm text-gray-500">Cần xử lý</p>
                            <p className="text-2xl font-bold">{adjustmentCount}</p>
                        </div>
                    </div>
                </div>

            </div>

            {/* DANH SÁCH PHIẾU */}
            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">

                <div className="p-5 border-b flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                    <div>
                        <h2 className="text-lg font-bold">
                            Danh sách phiếu nhận nguyên liệu
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Phiếu do Bộ phận Kế hoạch sản xuất chuyển đến.
                        </p>
                    </div>

                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-3 top-3 text-gray-400"
                        />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Tìm mã phiếu hoặc mã kế hoạch..."
                            className="border rounded-lg pl-10 pr-4 py-2 w-full md:w-80 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="p-4">Mã phiếu</th>
                                <th className="p-4">Mã kế hoạch</th>
                                <th className="p-4">Sản phẩm</th>
                                <th className="p-4">Ngày nhận</th>
                                <th className="p-4">Trạng thái</th>
                                <th className="p-4 text-center">Thao tác</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {filteredReceipts.map((receipt) => (
                                <tr key={receipt.maPhieu} className="hover:bg-gray-50">
                                    <td className="p-4 font-semibold text-blue-700">
                                        {receipt.maPhieu}
                                    </td>

                                    <td className="p-4">{receipt.maKeHoach}</td>
                                    <td className="p-4">{receipt.sanPham}</td>
                                    <td className="p-4">{receipt.ngayNhan}</td>

                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(receipt.trangThai)}`}>
                                            {receipt.trangThai}
                                        </span>
                                    </td>

                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => openReceipt(receipt)}
                                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
                                        >
                                            <Eye size={16} />
                                            {receipt.trangThai === 'Chờ tiếp nhận'
                                                ? 'Kiểm tra'
                                                : 'Xem chi tiết'}
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {filteredReceipts.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500">
                                        Không tìm thấy phiếu nhận nguyên liệu.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* CHI TIẾT PHIẾU */}
            {selectedReceipt && (
                <div className="bg-white border rounded-xl shadow-sm overflow-hidden">

                    <div className="p-5 border-b bg-blue-50 flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">
                                Chi tiết phiếu {selectedReceipt.maPhieu}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Sản phẩm sản xuất: {selectedReceipt.sanPham}
                            </p>
                        </div>

                        <button
                            onClick={closeReceipt}
                            className="text-gray-500 hover:text-red-600"
                        >
                            Đóng
                        </button>
                    </div>

                    <div className="p-5 space-y-6">

                        {/* THÔNG TIN PHIẾU */}
                        <section>
                            <h3 className="font-bold mb-3">
                                1. Thông tin phiếu nhận nguyên liệu
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-sm text-gray-500">Mã phiếu</p>
                                    <p className="font-semibold">{selectedReceipt.maPhieu}</p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-sm text-gray-500">Mã kế hoạch</p>
                                    <p className="font-semibold">{selectedReceipt.maKeHoach}</p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-sm text-gray-500">Ngày nhận</p>
                                    <p className="font-semibold">{selectedReceipt.ngayNhan}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3 mt-3">
                                <p className="text-sm text-gray-500">Ghi chú kế hoạch</p>
                                <p>{selectedReceipt.ghiChuKeHoach || 'Không có ghi chú.'}</p>
                            </div>
                        </section>

                        {/* DANH SÁCH NGUYÊN LIỆU */}
                        <section>
                            <div className="flex items-center gap-2 mb-3">
                                <Package className="text-blue-600" size={21} />
                                <h3 className="font-bold">
                                    2. Danh sách nguyên liệu cần nhận
                                </h3>
                            </div>

                            <div className="overflow-x-auto border rounded-lg">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="p-3 text-left">Mã nguyên liệu</th>
                                            <th className="p-3 text-left">Tên nguyên liệu</th>
                                            <th className="p-3 text-right">Số lượng kế hoạch</th>
                                            <th className="p-3 text-left">Đơn vị</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y">
                                        {selectedReceipt.nguyenLieu.map((item) => (
                                            <tr key={item.maHang}>
                                                <td className="p-3">{item.maHang}</td>
                                                <td className="p-3 font-medium">{item.tenHang}</td>
                                                <td className="p-3 text-right">
                                                    {item.soLuong.toLocaleString('vi-VN')}
                                                </td>
                                                <td className="p-3">{item.donVi}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* PHẢN HỒI CỦA XƯỞNG */}
                        <section className="border-t pt-5">
                            <h3 className="font-bold mb-3">
                                3. Kết quả kiểm tra nguyên liệu
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                                <button
                                    type="button"
                                    disabled={selectedReceipt.trangThai !== 'Chờ tiếp nhận'}
                                    onClick={() => setResult('Đã nhận đủ')}
                                    className={`p-4 rounded-lg border-2 flex items-center gap-3 ${result === 'Đã nhận đủ'
                                            ? 'border-green-500 bg-green-50 text-green-700'
                                            : 'border-gray-200 hover:bg-gray-50'
                                        } disabled:opacity-60`}
                                >
                                    <CheckCircle size={22} />
                                    <span className="font-semibold">Đã nhận đủ nguyên liệu</span>
                                </button>

                                <button
                                    type="button"
                                    disabled={selectedReceipt.trangThai !== 'Chờ tiếp nhận'}
                                    onClick={() => setResult('Cần xử lý')}
                                    className={`p-4 rounded-lg border-2 flex items-center gap-3 ${result === 'Cần xử lý'
                                            ? 'border-red-500 bg-red-50 text-red-700'
                                            : 'border-gray-200 hover:bg-gray-50'
                                        } disabled:opacity-60`}
                                >
                                    <AlertCircle size={22} />
                                    <span className="font-semibold">Cần xử lý</span>
                                </button>

                            </div>

                            <div className="mt-4">
                                <label className="block font-semibold text-gray-700 mb-2">
                                    Ghi chú của Xưởng
                                    {result === 'Cần xử lý' && (
                                        <span className="text-red-500"> *</span>
                                    )}
                                </label>

                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    disabled={selectedReceipt.trangThai !== 'Chờ tiếp nhận'}
                                    rows={4}
                                    placeholder="Nhập lý do nếu nguyên liệu thiếu, sai hoặc có vấn đề..."
                                    className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                />
                            </div>

                            {selectedReceipt.trangThai === 'Chờ tiếp nhận' ? (
                                <div className="flex justify-end gap-3 mt-5">
                                    <button
                                        onClick={closeReceipt}
                                        className="px-5 py-2 border rounded-lg hover:bg-gray-50"
                                    >
                                        Hủy
                                    </button>

                                    <button
                                        onClick={handleSubmit}
                                        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                    >
                                        <Send size={17} />
                                        Gửi xác nhận
                                    </button>
                                </div>
                            ) : (
                                <div className="mt-5 p-3 bg-gray-50 rounded-lg">
                                    <p className="font-semibold">
                                        Trạng thái: {selectedReceipt.trangThai}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {selectedReceipt.ghiChuXuong || 'Không có ghi chú.'}
                                    </p>
                                </div>
                            )}
                        </section>

                    </div>
                </div>
            )}

            <p className="text-xs text-gray-400">
                Người tiếp nhận: {currentUser?.name || 'Nhân viên Xưởng'}
            </p>

        </div>
    );
}
