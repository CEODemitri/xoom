import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TopBar } from './TopBar';
import { BottomTabBar } from './BottomTabBar';
import { COPY } from '../../constants/content';
import { useStore } from '../../store/useStore';

export const Layout: React.FC = () => {
  const location = useLocation();
  const { settings } = useStore();

  const isFullscreenRoute =
    location.pathname === '/train/active' ||
    location.pathname === '/train/complete' ||
    location.pathname === '/mind/breathe' ||
    location.pathname === '/mind/pause';

  const isBuildRoute = location.pathname === '/train/build';
  const isLandingRoute = location.pathname === '/train' || location.pathname === '/';

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#18181B] flex flex-col font-sans">
      {/* Accessible skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#09090B] focus:text-[#FFFFFF] focus:text-xs focus:font-semibold"
      >
        {COPY.a11y.skipToContent}
      </a>

      {!isFullscreenRoute && <TopBar />}

      <main
        id="main-content"
        className={`w-full max-w-[720px] mx-auto px-4 sm:px-5 ${
          isFullscreenRoute
            ? 'flex-1 py-6'
            : isBuildRoute
            ? 'h-[calc(100dvh-56px)] max-h-[calc(100dvh-56px)] flex flex-col pt-2 pb-0 overflow-hidden'
            : isLandingRoute
            ? 'h-[calc(100dvh-56px)] max-h-[calc(100dvh-56px)] flex flex-col pt-2 sm:pt-3 pb-20 overflow-hidden'
            : 'flex-1 pt-4 pb-28 md:py-8 md:pb-28'
        }`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={
              settings.reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 8 }
            }
            animate={
              settings.reduceMotion
                ? { opacity: 1 }
                : { opacity: 1, y: 0 }
            }
            exit={
              settings.reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -4 }
            }
            transition={{
              duration: settings.reduceMotion ? 0.15 : 0.22,
              ease: 'easeOut',
            }}
            className={isLandingRoute || isBuildRoute ? 'w-full h-full flex flex-col min-h-0' : 'w-full'}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {!isFullscreenRoute && <BottomTabBar />}
    </div>
  );
};
