// components/WarningIndicator.js
import { useState } from "react";

export default function WarningIndicator({ warnings }) {
  const [open, setOpen] = useState(false);

  if (!warnings || warnings.length === 0) return null;

  return (
    <div className="relative inline-block text-right">
      {/* زر الأيقونة */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center text-yellow-600 transition bg-yellow-100 rounded-full shadow  w-7 h-7 hover:bg-yellow-200"
      >
        ⚠️
      </button>

      {/* البوب-أب */}
      {open && (
        <div
          className="absolute right-0 z-50 p-3 text-xs bg-white border border-gray-200 rounded-lg shadow-xl  top-8 w-52 animate-fade"
        >
          <p className="mb-2 font-semibold text-gray-700">
            تفاصيل التحذيرات:
          </p>
          <ul className="space-y-1 overflow-y-auto max-h-40">
            {warnings.map((w, i) => (
              <li
                key={i}
                className="bg-gray-50 border rounded p-1.5 text-[11px]"
              >
                {w}
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="
              mt-3 w-full py-1 
              bg-gray-800 text-white 
              rounded text-[11px]
            "
          >
            إغلاق
          </button>
        </div>
      )}
    </div>
  );
}
