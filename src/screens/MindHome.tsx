import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { COPY } from '../constants/content';
import { useStore } from '../store/useStore';

export const MindHome: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useStore();

  const tools = [
    {
      id: 'breathe',
      title: COPY.mind.breathe,
      desc: COPY.mind.breatheDesc,
      route: '/mind/breathe',
    },
    {
      id: 'pause',
      title: COPY.mind.pause,
      desc: COPY.mind.pauseDesc,
      route: '/mind/pause',
    },
    {
      id: 'check-in',
      title: COPY.mind.checkIn,
      desc: COPY.mind.checkInDesc,
      route: '/mind/check-in',
    },
  ];

  return (
    <div className="flex flex-col space-y-8">
      {/* Header */}
      <div>
        <p className="font-serif font-medium text-base text-[#71717A]">
          {COPY.mind.intro}
        </p>
        <h1 className="font-serif font-semibold text-3xl md:text-4xl text-[#09090B] mt-1 tracking-[-0.02em]">
          {COPY.mind.title}
        </h1>
      </div>

      {/* 3 Tool Cards */}
      <div className="flex flex-col space-y-4">
        {tools.map((tool) => (
          <motion.button
            key={tool.id}
            type="button"
            onClick={() => navigate(tool.route)}
            whileTap={!settings.reduceMotion ? { scale: 0.985 } : undefined}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="w-full text-left bg-[#FFFFFF] border border-[#E4E4E7] p-6 rounded-xl focus-visible:outline-2 focus-visible:outline-[#09090B] transition-colors hover:border-[#71717A]/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
          >
            <h2 className="font-serif font-semibold text-xl text-[#09090B]">
              {tool.title}
            </h2>
            <p className="font-sans text-sm text-[#71717A] mt-1.5 leading-relaxed">
              {tool.desc}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
