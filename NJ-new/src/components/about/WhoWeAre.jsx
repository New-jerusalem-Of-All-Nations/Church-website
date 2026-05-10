// import React from 'react';
// import { motion } from 'framer-motion';

// export default function WhoWeAre() {
//   return (
//     <motion.div
//       key="who-we-are"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       transition={{ duration: 0.5 }}
//       className="w-full bg-white rounded-[1.5rem] p-8 sm:p-12 lg:p-16 shadow-1xl"
//     >
//       {/* Header Section matching screenshot layout */}
//       <div className="mb-10">
//         <motion.h3 
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.1 }}
//           className="text-gray-500 font-semibold text-lg sm:text-xl mb-3"
//         >
//           Meet Our Prophets
//         </motion.h3>
//         <motion.h2 
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//           className="text-4xl sm:text-5xl lg:text-4xl font-bold text-gray-900 tracking-tight"
//         >
//           Prophet V.Dyani & Prophetess Amorin Dyani
//         </motion.h2>
//       </div>

//       {/* Large Featured Image */}
//       <motion.div 
//         initial={{ opacity: 0, scale: 0.98 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.7, delay: 0.3 }}
//         className="max-w-4xl aspect-[16/9] sm:aspect-[2/1] relative rounded-3xl overflow-hidden mb-12 bg-gray-100"
//       >
//         <img 
//           src="../images/man.jpg" 
//           alt="Prophet V.Dyani and Prophetess Amorin Dyani" 
//           className="absolute inset-0 w-full h-full object-cover object-top"
//         />
//       </motion.div>

//       {/* Content Section */}
//       <motion.div 
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, delay: 0.4 }}
//         className="max-w-4xl"
//       >
//         <p className="text-xl sm:text-2xl text-gray-800 font-medium mb-10 italic border-l-4 border-gray-900 pl-6 py-1">
//           "Rooted in faith, united in love."
//         </p>
        
//         <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
//           <p>
//             <strong className="text-gray-900 font-semibold">New Jerusalem of All Nations</strong>, established in 2010 by Prophet V.Dyani and Prophetess Amorin Dyani, is a church grounded in the word of God and is guided by the Holy Spirit in all its endeavours.
//           </p>
//           <p>
//             We believe in the redemptive power of Jesus Christ's sacrifice, through which we have been reconciled with God, and we identify as sons and daughters of the Most high.
//           </p>
//           <p>
//             Our unwavering faith, profound love for God, and steadfast commitment to serving His people define our ministry.
//           </p>
//           <p>
//             If you seek a congregation devoted to a Christ-centered life and global dissemination of the gospel, we warmly invite you to join us on our faith journey.
//           </p>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// }
