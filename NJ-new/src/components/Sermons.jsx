import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Calendar, VideoOff } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

export default function Sermons() {
  const [latestSermon, setLatestSermon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSermons = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_ENDPOINTS.SERMONS}?limit=1`);
        const result = await response.json();
        const sermon = result.data?.[0];

        if (sermon) {
          setLatestSermon({
            id: sermon._id || sermon.id,
            title: sermon.title,
            description: sermon.description,
            thumbnail:
              sermon.thumbnail ||
              'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1400&q=80',
            date: new Date(sermon.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }),
          });
        }
      } catch (error) {
        console.error('Error fetching sermon:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSermons();
  }, []);

  return (
    <section id="sermons" className="py-24 bg-[#ffffff] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* KEEP THIS HEADER EXACTLY */}
        <div className="text-center mb-16">
          <span className="text-[#f0ad4e] font-bold tracking-widest uppercase text-sm">
            Watch
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mt-2 mb-4 text-[#1a1a1a]">
            Latest Sermons
          </h2>
          <div className="w-24 h-1 bg-[#f0ad4e] mx-auto mb-6 rounded-full"></div>

          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Listen to messages of hope and encouragement to build your{' '}
            <i className="text-[#f0ad4e] not-italic font-semibold">FAITH</i>.
          </p>
        </div>

        {/* CONTENT */}
        {isLoading ? (
          <div className="h-[500px] bg-gray-200 rounded-3xl animate-pulse"></div>
        ) : latestSermon ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full h-[500px] md:h-[600px] lg:h-[650px] rounded-3xl overflow-hidden shadow-2xl group cursor-pointer"
          >
            {/* IMAGE */}
            <img
              src={latestSermon.thumbnail}
              alt={latestSermon.title}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

            {/* TEXT CONTENT */}
            <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white max-w-3xl">
              <div className="flex items-center gap-2 text-[#f0ad4e] mb-4 text-sm">
                <Calendar className="w-4 h-4" />
                <span>{latestSermon.date}</span>
              </div>

              <h3 className="text-3xl md:text-5xl font-serif font-bold mb-4 leading-tight">
                {latestSermon.title}
              </h3>

              <p className="text-gray-300 text-lg">
                {latestSermon.description ||
                  'Join us for this powerful message of faith and transformation.'}
              </p>
            </div>

            {/* PLAY BUTTON */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-[#f0ad4e] text-black p-6 rounded-full shadow-lg group-hover:scale-110 transition">
                <Play className="w-10 h-10 fill-current ml-1" />
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <VideoOff className="mx-auto mb-4 text-gray-400 w-10 h-10" />
            <p className="text-gray-500">No sermon available right now.</p>
          </div>
        )}
      </div>
    </section>
  );
}