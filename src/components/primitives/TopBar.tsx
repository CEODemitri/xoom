import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogoLockup, PersonMark } from '../icons';
import { COPY } from '../../constants/content';
import { useStore } from '../../store/useStore';

export const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useStore();
  const [hasScrolled, setHasScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isYouActive = location.pathname.startsWith('/you');

  return (
    <header
      className={`sticky top-0 z-30 w-full bg-[#F4F0E8] transition-colors ${
        hasScrolled ? 'border-b border-[#DFD7C8]' : 'border-b border-transparent'
      }`}
    >
      <div className="max-w-[720px] mx-auto h-14 px-5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/train')}
          className="focus-visible:outline-2 focus-visible:outline-[#B85A3C] focus-visible:outline-offset-2 p-1 -ml-1 text-left"
          aria-label={COPY.a11y.logoLabel}
        >
          <LogoLockup isReducedMotion={settings.reduceMotion} />
        </button>

        <button
          type="button"
          onClick={() => navigate('/you')}
          className={`min-w-[44px] min-h-[44px] flex items-center justify-center p-2 focus-visible:outline-2 focus-visible:outline-[#B85A3C] focus-visible:outline-offset-2 transition-colors ${
            isYouActive ? 'text-[#B85A3C]' : 'text-[#78716A] hover:text-[#1B1916]'
          }`}
          aria-label={COPY.a11y.profileLabel}
          aria-current={isYouActive ? 'page' : undefined}
        >
          <PersonMark size={20} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
};
