import React from 'react'
import { X } from 'lucide-react'

export default function SermonDrawer({ isOpen, onClose, sermons }) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out max-h-[80vh] overflow-hidden flex flex-col ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-2xl font-bold text-gray-900">All Sermons</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Sermons List */}
        <div className="overflow-y-auto flex-1 px-6 py-4">
          <div className="space-y-4 pb-6">
            {sermons.map((sermon, index) => (
              <div
                key={sermon.id}
                className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="flex gap-4 p-4">
                  {/* Thumbnail */}
                  <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                    <img
                      src={sermon.thumbnail}
                      alt={sermon.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-brand-gold font-semibold mb-1">
                      {index + 1} of {sermons.length}
                    </p>
                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-brand-gold transition-colors">
                      {sermon.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {sermon.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {sermon.date}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
