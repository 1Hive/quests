import React, { createContext, useContext, useState } from 'react';

type ModalContextModel = {
  isOpen: boolean;
  setIsOpen: (_isOpen: boolean) => void;
};

const ModalContext = createContext<ModalContextModel | undefined>(undefined);
export const useModalContext = () => useContext(ModalContext)!;

type Props = {
  children: React.ReactNode;
};
export const ModalContextProvider = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return <ModalContext.Provider value={{ isOpen, setIsOpen }}>{children}</ModalContext.Provider>;
};
