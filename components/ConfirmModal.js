export default function ConfirmModal({ visible, title, message, confirmText, confirmColor, onConfirm, onCancel }) {
  if (!visible) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
      <div className="w-full max-w-sm p-6 text-right bg-white rounded-lg shadow-lg">
        <h3 className="mb-2 text-lg font-semibold text-gray-800">{title}</h3>
        <p className="mb-4 text-sm text-gray-600">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-white rounded-md hover:opacity-90"
            style={{ backgroundColor: confirmColor || '#ef4444' }}
          >
            {confirmText || 'تأكيد'}
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  )
}
