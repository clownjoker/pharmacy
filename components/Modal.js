// components/Modal.js
import React, { useEffect } from 'react'

export default function Modal({
  title,
  children,
  onClose,
  onConfirm,
  confirmText = 'حفظ',
  cancelText = 'إلغاء',
  showFooter = true,
  size = 'md', // sm | md | lg | xl
}) {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
  }

  // 🔹 منع التمرير أثناء فتح المودال
  useEffect(() => {
    document.body.classList.add('modal-open')
    return () => document.body.classList.remove('modal-open')
  }, [])

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-[2px] px-4"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${sizeClasses[size]} p-6 bg-white rounded-lg shadow-xl border border-gray-100 animate-fadeIn`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* رأس المودال */}
        <div className="flex items-center justify-between pb-2 mb-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-2xl font-bold text-gray-400 transition hover:text-gray-600"
          >
            ×
          </button>
        </div>

        {/* المحتوى */}
        <div className="max-h-[70vh] overflow-y-auto text-gray-700">{children}</div>

        {/* التذييل (الأزرار) */}
        {showFooter && (
          <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-5 py-2 text-sm text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50"
            >
              {cancelText}
            </button>

            {onConfirm && (
              <button
                onClick={onConfirm}
                className="px-5 py-2 text-sm text-white rounded-md shadow-sm bg-sky-600 hover:bg-sky-700"
              >
                {confirmText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}






// // components/Modal.js
// import React from 'react'

// export default function Modal({
//   title,
//   children,
//   onClose,
//   onConfirm,
//   confirmText = 'حفظ',
//   cancelText = 'إلغاء',
//   showFooter = true,
//   size = 'md', // sm | md | lg
// }) {
//   const sizeClasses = {
//     sm: 'max-w-sm',
//     md: 'max-w-lg',
//     lg: 'max-w-3xl',
//   }

//   return (
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
//       <div
//         className={`relative w-full ${sizeClasses[size]} p-6 bg-white rounded-lg shadow-xl animate-fadeIn`}
//         dir="rtl"
//       >
//         {/* رأس النافذة */}
//         <div className="flex items-center justify-between pb-2 mb-4 border-b">
//           <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
//           <button
//             onClick={onClose}
//             className="text-2xl font-bold text-gray-400 transition hover:text-gray-600"
//           >
//             ×
//           </button>
//         </div>

//         {/* محتوى النافذة */}
//         <div className="max-h-[70vh] overflow-y-auto text-gray-700">{children}</div>

//         {/* أزرار التحكم */}
//         {showFooter && (
//           <div className="flex justify-end gap-3 pt-3 mt-6 border-t">
//             <button
//               onClick={onClose}
//               className="px-5 py-2 text-sm text-gray-600 border rounded-md hover:bg-gray-50"
//             >
//               {cancelText}
//             </button>
//             {onConfirm && (
//               <button
//                 onClick={onConfirm}
//                 className="px-5 py-2 text-sm text-white rounded-md bg-sky-600 hover:bg-sky-700"
//               >
//                 {confirmText}
//               </button>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
