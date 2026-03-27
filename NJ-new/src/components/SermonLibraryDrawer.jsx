import React, { useState, useEffect } from 'react'
import { X, Search } from 'lucide-react'

export default function SermonLibraryDrawer({ isOpen, onClose, sermons }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedYear, setSelectedYear] = useState('all')
  const [selectedTopic, setSelectedTopic] = useState('all')
  const [selectedTestimony, setSelectedTestimony] = useState('all')
  const [filteredSermons, setFilteredSermons] = useState(sermons)

  // Extract unique values for filters
  const years = ['all', ...new Set(sermons.map(s => s.year))].sort((a, b) => {
    if (a === 'all') return -1
    if (b === 'all') return 1
    return b - a
  })

  const topics = ['all', ...new Set(sermons.map(s => s.topic).filter(Boolean))]
  const testimonies = ['all', ...new Set(sermons.map(s => s.testimony).filter(Boolean))]

  // Filter sermons based on search and filters
  useEffect(() => {
    let results = sermons.filter(sermon => {
      const matchesSearch =
        sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sermon.pastor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sermon.testimony && sermon.testimony.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesYear = selectedYear === 'all' || sermon.year === parseInt(selectedYear)
      const matchesTopic = selectedTopic === 'all' || sermon.topic === selectedTopic
      const matchesTestimony = selectedTestimony === 'all' || sermon.testimony === selectedTestimony

      return matchesSearch && matchesYear && matchesTopic && matchesTestimony
    })

    setFilteredSermons(results)
  }, [searchQuery, selectedYear, selectedTopic, selectedTestimony, sermons])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

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
        className={`fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out max-h-[90vh] overflow-hidden flex flex-col ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-3xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Sermon Library</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, pastor, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent text-sm"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-3 gap-3">
            {/* Year Filter */}
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase block mb-2">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent"
              >
                {years.map(year => (
                  <option key={year} value={year.toString()}>
                    {year === 'all' ? 'All Years' : year}
                  </option>
                ))}
              </select>
            </div>

            {/* Topic Filter */}
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase block mb-2">Topic</label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent"
              >
                {topics.map(topic => (
                  <option key={topic} value={topic}>
                    {topic === 'all' ? 'All Topics' : topic}
                  </option>
                ))}
              </select>
            </div>

            {/* Testimony Filter */}
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase block mb-2">Testimony</label>
              <select
                value={selectedTestimony}
                onChange={(e) => setSelectedTestimony(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent"
              >
                {testimonies.slice(0, 6).map(testimony => ( // Limit to first 6 to avoid too long list
                  <option key={testimony} value={testimony}>
                    {testimony === 'all' ? 'All Testimonies' : testimony}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Sermons List */}
        <div className="overflow-y-auto flex-1 px-6 py-4">
          {filteredSermons.length > 0 ? (
            <div className="space-y-3 pb-6">
              {filteredSermons.map((sermon, index) => (
                <div
                  key={sermon.id}
                  className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-brand-gold transition-all duration-300 cursor-pointer p-4"
                >
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    {sermon.thumbnail && (
                      <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                        <img
                          src={sermon.thumbnail}
                          alt={sermon.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 group-hover:text-brand-gold transition-colors line-clamp-2 text-sm">
                          {sermon.title}
                        </h3>
                        <span className="text-xs font-semibold text-brand-gold bg-yellow-50 px-2 py-1 rounded whitespace-nowrap">
                          {sermon.year}
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 mb-2">
                        {sermon.pastor}
                      </p>

                      {sermon.topic && (
                        <div className="flex gap-2 flex-wrap mb-2">
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {sermon.topic}
                          </span>
                        </div>
                      )}

                      {sermon.testimony && (
                        <p className="text-xs text-gray-500 line-clamp-1 italic">
                          "{sermon.testimony}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-gray-500 text-lg mb-2">No sermons found</p>
                <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-3 text-sm text-gray-600">
          Showing {filteredSermons.length} of {sermons.length} sermons
        </div>
      </div>
    </>
  )
}
