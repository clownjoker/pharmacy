import { useState } from 'react'

export default function PasswordField({ value, onChange }) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative mb-4">
      <label className="block mb-1 text-sm text-gray-600">كلمة المرور</label>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="••••••••"
        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-400 focus:outline-none"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute inset-y-0 flex items-center text-gray-500 left-3 hover:text-gray-700"
      >
        {show ? '🙈' : '👁️'}
      </button>
    </div>
  )
}
