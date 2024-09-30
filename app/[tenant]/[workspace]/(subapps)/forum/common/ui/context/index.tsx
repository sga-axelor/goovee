'use client';

import React, {useContext} from 'react';

export const ForumContext = React.createContext<any>({});

export default function ForumContextProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: any;
}) {
  return (
    <ForumContext.Provider value={value}>{children}</ForumContext.Provider>
  );
}

export function useForum() {
  return useContext(ForumContext);
}
