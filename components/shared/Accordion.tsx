'use client';

import {useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {ChevronDown} from 'lucide-react';
import React from 'react';

type AccordionSectionProps = {
  /** Title - can be a string or React node */
  title: React.ReactNode;
  /** Optional selected/subtitle text to display (when title is a string) */
  selected?: string;
  /** Content to show/hide */
  children: React.ReactNode;
  /** Whether the accordion is open by default */
  defaultOpen?: boolean;
  /** Only used internally by Accordion wrapper */
  isControlled?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;

  /** Optional className for styling */
  className?: string;
  /** Optional className for the header */
  headerClassName?: string;
  /** Optional className for the content section */
  contentClassName?: string;
  /** Show chevron icon */
  showChevron?: boolean;
  /** Unique identifier for the section (needed for React node titles) */
  id?: string;
};

type AccordionProps = {
  /** If true, only one section can be open at a time */
  singleOpen?: boolean;
  children: React.ReactNode;
  preventSelfClose?: boolean;
  /** Optional className for the wrapper */
  className?: string;
};

export function Accordion({
  singleOpen = false,
  preventSelfClose = false,
  children,
  className = 'flex flex-col gap-2',
}: AccordionProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  // Clone children and add controlled props if in single open mode
  const childrenWithProps = React.Children.map(children, (child) => {
    // Make sure child is a valid AccordionSection component
    if (
      !React.isValidElement<AccordionSectionProps>(child) ||
      child.type !== AccordionSection
    ) {
      console.warn('Accordion children must be AccordionSection components');
      return child;
    }

    if (singleOpen) {
      // Get a unique identifier for the section
      const sectionId =
        // If title is a string, use it
        typeof child.props.title === 'string'
          ? child.props.title
          : // Otherwise use provided id
            child.props.id ||
            // Or fallback to index/key
            child.key?.toString() ||
            // Last resort random ID
            Math.random().toString(36).substring(2, 9);

      return React.cloneElement(child, {
        isControlled: true,
        isOpen: openSection === sectionId,
        onToggle: () => {
          if (preventSelfClose && openSection === sectionId) return;
          setOpenSection(openSection === sectionId ? null : sectionId);
        },

        id: sectionId, 
      });
    }

    return child;
  });

  return <div className={className}>{childrenWithProps}</div>;
}

export default function AccordionSection({
  title,
  selected,
  children,
  defaultOpen = false,
  isControlled: isControlledProp = false,
  isOpen: controlledIsOpen,
  onToggle,

  className = '',
  headerClassName = 'flex justify-between items-center py-4 cursor-pointer',
  contentClassName = 'flex flex-col gap-1 text-base',
  showChevron = true,
  id,
}: AccordionSectionProps) {
  const [isOpenInternal, setIsOpenInternal] = useState(defaultOpen);

  const isEffectivelyControlled =
    controlledIsOpen !== undefined || isControlledProp;

  const isOpen = isEffectivelyControlled ? controlledIsOpen : isOpenInternal;
  const toggleOpen = isEffectivelyControlled
    ? onToggle
    : () => setIsOpenInternal(!isOpenInternal);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleOpen?.();
    }
  };

  return (
    <div className={className} data-section-id={id}>
      {/* Header + chevron */}
      <motion.header
        initial={false}
        className={headerClassName}
        onClick={toggleOpen}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        role='button'
        aria-expanded={isOpen}
      >
        {typeof title === 'string' ? (
          <span>
            <h2 className='text-gray-900'>{title}</h2>
            {selected && (
              <span className='text-xs text-gray-500 uppercase'>
                {selected}
              </span>
            )}
          </span>
        ) : (
          title
        )}

        {showChevron && (
          <ChevronDown
            className={`transition-transform duration-300 mr-2 ${isOpen ? 'rotate-180' : ''}`}
            size={20}
            strokeWidth={isOpen ? 1.5 : 1}
          />
        )}
      </motion.header>

      {/* Content area */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            key='content'
            initial='collapsed'
            animate='open'
            exit='collapsed'
            variants={{
              open: {opacity: 1, height: 'auto', marginBottom: '1rem'},
              collapsed: {opacity: 0, height: 0, marginBottom: 0},
            }}
            transition={{duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98]}}
          >
            <div className={contentClassName}>{children}</div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
