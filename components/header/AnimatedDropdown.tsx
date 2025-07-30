'use client';
import React, {ReactNode} from 'react';
import {motion, Variants} from 'framer-motion';
import {X} from 'lucide-react';

// ==================== 1. Stängningsknapp (X) ====================
interface MotionCloseXProps {
  onClick: () => void;
  className?: string;
  size?: number;
  strokeWidth?: number;
  withTranslate?: boolean;
}

export const MotionCloseX = ({
  onClick,
  className = '',
  size = 15,
  strokeWidth = 1.5,
  withTranslate = false,
}: MotionCloseXProps) => {
  return (
    <motion.button
      onClick={onClick}
      className={`cursor-pointer z-50 ${className}`}
      aria-label='Stäng meny'
      initial={withTranslate ? {opacity: 0, rotate: -90, translateX: -2} : {}}
      animate={withTranslate ? {opacity: 1, rotate: 0, translateX: 0} : {}}
      transition={{delay: 0.2, duration: 0.3}}
    >
      <X size={size} strokeWidth={strokeWidth} />
    </motion.button>
  );
};

// ==================== 2. Dropdown Motion Div ====================
interface MotionDropdownProps {
  children: ReactNode;
  onMouseLeave?: () => void;
  className?: string;
  id?: string;
  isMobile?: boolean;
  position?: 'left' | 'right';
}

export const MotionDropdown = ({
  children,
  onMouseLeave,
  className = '',
  isMobile = false,
  id = 'dropdown',
  position = 'left',
}: MotionDropdownProps) => {
  const leftVariants: Variants = {
    hidden: {x: -100, opacity: 0, width: 0},
    visible: {
      x: 0,
      opacity: 1,
      width: isMobile ? '100%' : 'auto',
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 200,
        duration: 0.3,
      },
    },
    exit: {x: -100, opacity: 0, width: 0, transition: {duration: 0.2}},
  };
  const rightVariants: Variants = {
    hidden: {x: 100, opacity: 0, width: 0},
    visible: {
      x: 0,
      opacity: 1,
      width: 'auto',
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 200,
        duration: 0.3,
      },
    },
    exit: {x: 100, opacity: 0, width: 0, transition: {duration: 0.2}},
  };

  const dropdownVariants = position === 'left' ? leftVariants : rightVariants;
  const positionClass = position === 'left' ? 'left-0' : 'right-0';

  return (
    <motion.div
      className={`fixed ${positionClass} top-0 h-full bg-white z-40 shadow-md ${className} ${isMobile ? 'w-full' : ''}`}
      initial='hidden'
      animate='visible'
      exit='exit'
      key={id}
      variants={dropdownVariants}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </motion.div>
  );
};

// ==================== 3. Overlay/Backdrop Motion Div ====================
interface MotionOverlayProps {
  onMouseEnter?: () => void;
  className?: string;
  isMobile?: boolean;
  id?: string;
  onClick?: () => void;
  ariaHidden?: boolean;
}

export const MotionOverlay = ({
  onMouseEnter,
  onClick,
  className = '',
  id = 'overlay',
  ariaHidden = true,
}: MotionOverlayProps) => {
  const backdropVariants = {
    hidden: {opacity: 0},
    visible: {opacity: 0.2, transition: {duration: 0.2}},
    exit: {opacity: 0, transition: {duration: 0.2}},
  };



  return (
    <motion.div
      className={`fixed inset-0 h-full cursor-pointer w-full bg-black z-30 ${className}`}
      variants={backdropVariants}
      initial='hidden'
      animate='visible'
      exit='exit'
      key={id}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      aria-hidden={ariaHidden}
    />
  );
};
