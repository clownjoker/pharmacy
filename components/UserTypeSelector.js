export default function UserTypeSelector({ userType, setUserType }) {
  return (
    <div className="mb-4">
      <label className="block mb-1 text-sm text-gray-600">نوع المستخدم</label>
      <select
        value={userType}
        onChange={(e) => setUserType(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-400 focus:outline-none"
      >
        <option value="manager">👨‍💼 المدير</option>
        <option value="pharmacist">💊 الصيدلي</option>
        <option value="cashier">💵 الكاشير</option>
      </select>
    </div>
  )
}
