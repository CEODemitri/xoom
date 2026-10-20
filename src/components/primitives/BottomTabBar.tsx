import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SessionMark, PersonMark, BreathMark, BowlMark } from '../icons';
import { COPY } from '../../constants/content';
import { useStore } from '../../store/useStore';

interface TabItem {
  id: string;
  label: string;
  route: string;
  icon: React.ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
}

const TABS: TabItem[] = [
  { id: 'train', label: COPY.tabs.train, route: '/train', icon: SessionMark },
  { id: 'you', label: COPY.tabs.you, route: '/you', icon: PersonMark },
  { id: 'mind', label: COPY.tabs.mind, route: '/mind', icon: BreathMark },
  { id: 'eat', label: COPY.tabs.eat, route: '/eat', icon: BowlMark },
];

export const BottomTabBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useStore();

  return (
    <nav
      role="navigation"
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#F4F0E8] border-t border-[#DFD7C8] pb-safe"
    >
      <div className="max-w-[720px] mx-auto h-16 grid grid-cols-4 items-center px-4">
        {TABS.map((tab) => {
          const isActive =
            tab.route === '/train'
              ? location.pathname === '/train' || location.pathname.startsWith('/train/build')
              : location.pathname.startsWith(tab.route);

          const IconComponent = tab.icon;

          return (
            <motion.button
              key={tab.id}
              type="button"
              onClick={() => navigate(tab.route)}
              whileTap={!settings.reduceMotion ? { scale: 0.94 } : undefined}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              aria-current={isActive ? 'page' : undefined}
              aria-label={tab.label}
              className={`flex flex-col items-center justify-center min-h-[44px] py-1 select-none focus-visible:outline-2 focus-visible:outline-[#B85A3C] focus-visible:outline-offset-2 transition-colors ${
                isActive ? 'text-[#B85A3C]' : 'text-[#78716A] hover:text-[#1B1916]'
              }`}
            >
              <IconComponent size={20} aria-hidden="true" />
              <span className="font-sans font-medium text-[0.6875rem] tracking-tight mt-1 leading-none">
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};
