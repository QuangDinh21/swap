import React from 'react';
import { Header } from './Header';

interface Props {
  children: React.ReactNode;
}

export const Layout: React.FC<Props> = (props) => {
  const { children } = props;

  return (
    <div className="text-gray-900 bg-white flex flex-col w-full min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
};
