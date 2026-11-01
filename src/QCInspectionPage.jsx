import React, { useMemo, useState } from 'react';
import { ClipboardCheck, Clock3, CheckCircle2, AlertCircle, Search, Eye, ArrowLeft, Save, Pencil, FileCheck2 } from 'lucide-react';

// DỮ LIỆU MẪU: thay bằng dữ liệu backend khi nhóm triển khai API.
const SAMPLE_REQUESTS = [
  { id: 'KD202611010001', materialId: 'NL001', material: 'Đường tinh luyện', lot: 'LO-DUONG-001', status: 'Chờ kiểm định', criteria: [
    { id: 'duong1', name: 'Độ tinh khiết', unit: '%', min: 99.5, max: 100, required: true },
    { id: 'duong2', name: 'Độ ẩm', unit: '%', min: 0, max: 0.1, required: true },
    { id: 'duong3', name: 'Màu sắc', type: 'choice', required: true },
  ] },
  { id: 'KD202611010002', materialId: 'NL002', material: 'Nước xử lý', lot: 'LO-NUOC-002', status: 'Chờ kiểm định', criteria: [
    { id: 'nuoc1', name: 'pH', unit: 'pH', min: 6.5, max: 8.5, required: true },
    { id: 'nuoc2', name: 'Độ đục', unit: 'NTU', min: 0, max: 1, required: true },
    { id: 'nuoc3', name: 'Mùi', type: 'choice', required: true },
  ] },
  { id: 'KD202611010003', materialId: 'NL003', material: 'Khí CO₂ thực phẩm', lot: 'LO-CO2-003', status: 'Chờ kiểm định', criteria: [
    { id: 'co21', name: 'Độ tinh khiết', unit: '%', min: 99.9, max: 100, required: true },
    { id: 'co22', name: 'Mùi lạ', type: 'choice', required: true },
  ] },
];
const STORE_KEY = 'sixstar_qaqc_records_v1';
function readRecords() {
  try { const data = JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); return Array.isArray(data) ? data : []; }
  catch { return []; }
}
function validateCriteria(request, values) {
  const errors = {};
  const results = request.criteria.map(c => {
    const raw = String(values[c.id] ?? '').trim();
    if (!raw) { if (c.required) errors[c.id] = 'Bắt buộc nhập kết quả.'; return { ...c, value: raw, passed: false }; }
    if (c.type === 'choice') {
      if (!['Đạt', 'Không đạt'].includes(raw)) errors[c.id] = 'Kết quả không hợp lệ.';
      return { ...c, value: raw, passed: raw === 'Đạt' };
    }
    const number = Number(raw.replace(',', '.'));
    if (!Number.isFinite(number) || number < 0) errors[c.id] = 'Vui lòng nhập số hợp lệ, không âm.';
    return { ...c, value: raw, passed: Number.isFinite(number) && number >= c.min && number <= c.max };
  });
  return { errors, results, valid: Object.keys(errors).length === 0, conclusion: results.every(r => r.passed) ? 'Đạt' : 'Không đạt' };
}
const badge = status => status === 'Đạt' ? 'bg-green-100 text-green-700' : status === 'Không đạt' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700';
const formatDate = value => new Date(value).toLocaleString('vi-VN');

export function QCLookupPage({ records }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const filtered = records.filter(x => `${x.id} ${x.requestId} ${x.material} ${x.lot}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="space-y-6">
    <div><h1 className="text-2xl font-bold text-gray-900 flex gap-2 items-center"><Search className="text-blue-600"/> Tra cứu biên bản QA/QC</h1><p className="text-gray-500 mt-2">Các biên bản kiểm định đã xác nhận trên trình duyệt này.</p></div>
    <div className="bg-white border rounded-xl p-5 shadow-sm">
      <input aria-label="Tìm biên bản" className="w-full max-w-lg border rounded-lg p-3" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Tìm mã biên bản, mã phiếu, nguyên liệu, lô hàng..." />
      <div className="overflow-x-auto mt-4"><table className="w-full text-sm text-left"><thead className="bg-gray-50"><tr>{['Mã biên bản','Phiếu yêu cầu','Nguyên liệu / Lô','Thời gian','Kết luận','Thao tác'].map(x=><th className="p-3" key={x}>{x}</th>)}</tr></thead><tbody>{filtered.map(x=><tr key={x.id} className="border-t"><td className="p-3 font-semibold text-blue-700">{x.id}</td><td className="p-3">{x.requestId}</td><td className="p-3">{x.material}<div className="text-gray-500">{x.lot}</div></td><td className="p-3">{formatDate(x.createdAt)}</td><td className="p-3"><span className={`px-2 py-1 rounded-full ${badge(x.conclusion)}`}>{x.conclusion}</span></td><td className="p-3"><button className="text-blue-700 flex gap-1 items-center" onClick={()=>setSelected(x)}><Eye size={16}/> Xem</button></td></tr>)}</tbody></table>{filtered.length===0&&<p className="text-center text-gray-500 py-10">Chưa có biên bản phù hợp.</p>}</div>
    </div>
    {selected && <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center p-4" onClick={()=>setSelected(null)}><div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto space-y-3" onClick={e=>e.stopPropagation()}><h2 className="font-bold text-xl">Biên bản {selected.id}</h2><p>Phiếu yêu cầu: {selected.requestId} · Nguyên liệu: {selected.material} · Lô: {selected.lot}</p><p>Người kiểm định: {selected.inspector} · {formatDate(selected.createdAt)}</p><table className="w-full text-sm"><thead><tr className="bg-gray-100"><th className="p-2 text-left">Tiêu chí</th><th>Kết quả</th><th>Đánh giá</th></tr></thead><tbody>{selected.results.map(r=><tr key={r.id} className="border-b"><td className="p-2">{r.name}</td><td>{r.value}{r.unit?' '+r.unit:''}</td><td>{r.passed?'Đạt':'Không đạt'}</td></tr>)}</tbody></table><p className="font-semibold">Kết luận: {selected.conclusion}</p>{selected.reason&&<p>Lý do: {selected.reason}</p>}<button className="px-4 py-2 bg-gray-900 text-white rounded-lg" onClick={()=>setSelected(null)}>Đóng</button></div></div>}
  </div>;
}

export default function QCInspectionPage({ currentUser, records, setRecords }) {
  const [search, setSearch] = useState('');
  const [request, setRequest] = useState(null);
  const [values, setValues] = useState({});
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState({});
  const [phase, setPhase] = useState('edit');
  const [notice, setNotice] = useState('');
  const finished = new Set(records.map(r=>r.requestId));
  const pending = SAMPLE_REQUESTS.filter(x=>!finished.has(x.id));
  const filtered = pending.filter(x=>`${x.id} ${x.material} ${x.lot}`.toLowerCase().includes(search.toLowerCase()));
  const inspection = useMemo(()=>request ? validateCriteria(request,values) : null,[request,values]);
  const totalPassed = records.filter(x=>x.conclusion==='Đạt').length;
  const totalFailed = records.filter(x=>x.conclusion==='Không đạt').length;
  const proposedId = request ? `BBKD-${request.id}` : '';
  const begin = x => { setRequest(x); setValues({}); setReason(''); setErrors({}); setPhase('edit'); setNotice(''); };
  const review = () => {
    const check = validateCriteria(request,values);
    if (!check.valid) {setErrors(check.errors);setNotice('Vui lòng bổ sung hoặc sửa kết quả tiêu chí được đánh dấu.');return;}
    if (check.conclusion==='Không đạt'&&!reason.trim()) {setErrors({reason:'Bắt buộc nhập lý do không đạt.'});setNotice('Hãy nhập lý do không đạt trước khi tiếp tục.');return;}
    setErrors({});setNotice('');setPhase('review');
  };
  const save = () => {
    const check=validateCriteria(request,values);
    if (!check.valid || (check.conclusion==='Không đạt'&&!reason.trim())) {setPhase('edit');setErrors({...check.errors,...(check.conclusion==='Không đạt'&&!reason.trim()?{reason:'Bắt buộc nhập lý do.'}:{})});setNotice('Dữ liệu chưa hợp lệ, vui lòng kiểm tra lại.');return;}
    if (records.some(r=>r.requestId===request.id)) {setNotice('Phiếu này đã được lập biên bản.');return;}
    const record={id:proposedId,requestId:request.id,materialId:request.materialId,material:request.material,lot:request.lot,results:check.results,conclusion:check.conclusion,reason:check.conclusion==='Không đạt'?reason.trim():'',inspector:currentUser?.name||'QA/QC',createdAt:new Date().toISOString(),status:'Hoàn thành'};
    try {
      const updated=[...records,record];localStorage.setItem(STORE_KEY,JSON.stringify(updated));setRecords(updated);setRequest(null);setNotice(`Đã lưu biên bản ${record.id} thành công (dữ liệu demo trên trình duyệt).`);
    } catch {setNotice('Không thể lưu biên bản. Kiểm tra bộ nhớ trình duyệt và xác nhận lại.');}
  };
  return <div className="space-y-6">
    <div><h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3"><ClipboardCheck className="text-blue-600"/> Lập biên bản kiểm định chất lượng</h1><p className="text-gray-500 mt-2">Chọn phiếu yêu cầu, kiểm tra các tiêu chí và xác nhận kết quả của từng lô nguyên liệu.</p></div>
    {!request && <><div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {[["Tổng phiếu yêu cầu",SAMPLE_REQUESTS.length,ClipboardCheck,'text-blue-600'],['Chờ kiểm định',pending.length,Clock3,'text-amber-600'],['Đã đạt',totalPassed,CheckCircle2,'text-green-600'],['Không đạt',totalFailed,AlertCircle,'text-red-600']].map(([label,value,Icon,color])=><div key={label} className="bg-white border rounded-xl p-5 flex gap-4 items-center shadow-sm"><Icon size={26} className={color}/><div><p className="text-gray-500 text-sm">{label}</p><p className="text-2xl font-bold">{value}</p></div></div>)}
    </div><div className="bg-white border rounded-xl shadow-sm overflow-hidden"><div className="p-5 flex flex-wrap gap-3 items-center justify-between"><div><h2 className="font-bold text-lg">Danh sách phiếu yêu cầu kiểm định</h2><p className="text-sm text-gray-500">Các phiếu chờ QA/QC xử lý</p></div><input aria-label="Tìm phiếu" className="border rounded-lg px-3 py-2 text-sm w-full sm:w-80" placeholder="Tìm mã phiếu, nguyên liệu, lô hàng..." value={search} onChange={e=>setSearch(e.target.value)}/></div><div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead className="bg-gray-50"><tr>{['Mã phiếu yêu cầu','Mã nguyên liệu','Tên nguyên liệu','Mã lô hàng','Trạng thái','Thao tác'].map(x=><th className="p-4 whitespace-nowrap" key={x}>{x}</th>)}</tr></thead><tbody>{filtered.map(x=><tr key={x.id} className="border-t"><td className="p-4 font-semibold text-blue-700">{x.id}</td><td className="p-4">{x.materialId}</td><td className="p-4">{x.material}</td><td className="p-4">{x.lot}</td><td className="p-4"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">{x.status}</span></td><td className="p-4"><button onClick={()=>begin(x)} className="bg-blue-50 text-blue-700 rounded-lg px-3 py-2 hover:bg-blue-100 flex gap-2 items-center"><Eye size={16}/> Kiểm định</button></td></tr>)}</tbody></table>{filtered.length===0&&<div className="p-10 text-center text-gray-500">Không có phiếu yêu cầu kiểm định phù hợp.</div>}</div></div></>}
    {request && <div className="space-y-5"><button onClick={()=>{setRequest(null);setNotice('');}} className="text-blue-700 flex items-center gap-2"><ArrowLeft size={18}/> Quay lại danh sách</button><section className="bg-white border rounded-xl p-5 shadow-sm space-y-4"><div className="flex items-center justify-between"><h2 className="font-bold text-lg">{phase==='review'?'Xác nhận thông tin biên bản':'Thông tin biên bản kiểm định'}</h2><span className="bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-xs">{phase==='review'?'Bước xác nhận':'Đang nhập kết quả'}</span></div><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">{[['Mã biên bản (tự phát sinh)',proposedId],['Mã phiếu yêu cầu',request.id],['Mã nguyên liệu',request.materialId],['Tên nguyên liệu',request.material],['Mã lô hàng',request.lot],['Người thực hiện',currentUser?.name||'QA/QC']].map(([k,v])=><div key={k} className="bg-gray-50 border rounded-lg p-3"><p className="text-gray-500 mb-1">{k}</p><p className="font-semibold text-gray-900">{v}</p></div>)}</div></section>
    <section className="bg-white border rounded-xl p-5 shadow-sm"><h2 className="font-bold text-lg mb-2">Kết quả từng tiêu chí kiểm định</h2><p className="text-gray-500 text-sm mb-4">Giới hạn tiêu chí bên dưới là dữ liệu ví dụ, không phải tiêu chuẩn QC chính thức của nhà máy.</p><div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead className="bg-gray-50"><tr>{['Tiêu chí','Yêu cầu / ngưỡng mẫu','Kết quả kiểm định','Đánh giá'].map(x=><th className="p-3" key={x}>{x}</th>)}</tr></thead><tbody>{request.criteria.map(c=>{const evaluation=inspection.results.find(x=>x.id===c.id);return <tr className="border-t" key={c.id}><td className="p-3 font-medium">{c.name} {c.required&&<span className="text-red-500">*</span>}</td><td className="p-3 text-gray-600">{c.type==='choice'?'Đạt / Không đạt':`${c.min} – ${c.max} ${c.unit}`}</td><td className="p-3">{phase==='review'?<span>{values[c.id]} {c.unit||''}</span>:c.type==='choice'?<select aria-label={c.name} value={values[c.id]||''} onChange={e=>{setValues(v=>({...v,[c.id]:e.target.value}));setErrors(x=>({...x,[c.id]:''}));}} className="border rounded-lg p-2 w-44"><option value="">-- Chọn --</option><option>Đạt</option><option>Không đạt</option></select>:<input aria-label={c.name} type="text" inputMode="decimal" value={values[c.id]||''} onChange={e=>{setValues(v=>({...v,[c.id]:e.target.value}));setErrors(x=>({...x,[c.id]:''}));}} className="border rounded-lg p-2 w-44" placeholder={`Nhập ${c.unit}`} />}{errors[c.id]&&<p className="text-red-600 text-xs mt-1">{errors[c.id]}</p>}</td><td className="p-3">{!String(values[c.id]||'').trim()?'Chưa nhập':errors[c.id]?'Không hợp lệ':<span className={evaluation.passed?'text-green-700':'text-red-600'}>{evaluation.passed?'Đạt':'Không đạt'}</span>}</td></tr>;})}</tbody></table></div></section>
    {inspection.valid&&<section className="bg-white border rounded-xl p-5 shadow-sm space-y-4"><div className="flex flex-wrap gap-3 items-center"><span className="font-semibold">Kết luận kiểm định lô hàng:</span><span className={`px-3 py-1 rounded-full font-bold ${badge(inspection.conclusion)}`}>{inspection.conclusion}</span></div>{inspection.conclusion==='Không đạt'&&<div><label className="block font-semibold mb-2">Lý do không đạt <span className="text-red-600">*</span></label>{phase==='review'?<p className="bg-gray-50 rounded-lg p-3">{reason}</p>:<textarea rows={3} className="w-full border rounded-lg p-3" value={reason} onChange={e=>{setReason(e.target.value);setErrors(v=>({...v,reason:''}));}} placeholder="Nhập lý do lô hàng không đạt..."/>}{errors.reason&&<p className="text-red-600 text-sm mt-1">{errors.reason}</p>}</div>}</section>}
    <div className="flex justify-end gap-3">{phase==='review'?<><button onClick={()=>setPhase('edit')} className="border rounded-lg px-5 py-3 flex gap-2 items-center"><Pencil size={17}/> Chỉnh sửa</button><button onClick={save} className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-5 py-3 flex items-center gap-2"><Save size={17}/> Xác nhận lập biên bản</button></>:<button onClick={review} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 py-3 flex items-center gap-2"><FileCheck2 size={17}/> Kiểm tra và xem lại biên bản</button>}</div></div>}
    {notice&&<div role="status" className={`rounded-lg p-4 text-sm border ${notice.includes('thành công')?'bg-green-50 text-green-800 border-green-200':'bg-amber-50 text-amber-800 border-amber-200'}`}>{notice}</div>}
    <p className="text-xs text-gray-400">Bản demo React: phiếu và ngưỡng kiểm định là dữ liệu mẫu; biên bản được lưu trong localStorage của trình duyệt, chưa đồng bộ cơ sở dữ liệu.</p>
  </div>;
}
export { readRecords };
