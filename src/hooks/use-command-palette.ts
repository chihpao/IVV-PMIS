import { parseAsBoolean, useQueryState } from 'nuqs';
import { useState } from 'react';

export const useCommandPalette = () => {
  // Use nuqs to manage URL state for command palette
  const [isOpen, setIsOpen] = useQueryState('command-palette', parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true }));

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen,
  };
};
