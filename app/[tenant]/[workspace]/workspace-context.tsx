'use client';

import React, {useContext, useEffect, useMemo, useRef} from 'react';
import {
  DEFAULT_TENANT,
  DEFAULT_WORKSPACE,
  DEFAULT_WORKSPACE_URI,
} from '@/constants';

// ---- CORE IMPORTS ---- //
import {useTheme} from '@/app/theme';
import {Theme} from '@/types/theme';

export const WorkspaceContext = React.createContext<{
  tenant: string;
  workspace: string;
  workspaceURI: string;
}>({
  tenant: DEFAULT_TENANT,
  workspace: DEFAULT_WORKSPACE,
  workspaceURI: DEFAULT_WORKSPACE_URI,
});

export function Workspace({
  tenant,
  workspace,
  theme,
  children,
}: {
  tenant: string;
  workspace: string;
  theme?: {id: string; name: string; options: Theme};
  children: React.ReactNode;
}) {
  const {updateTheme} = useTheme();
  const prevTheme = useRef<any>();

  const workspaceURI = `/${tenant}/${workspace}`;
  const workspaceURL = `${process.env.NEXT_PUBLIC_HOST}${workspaceURI}`;

  const value = useMemo(
    () => ({tenant, workspace, workspaceURI, workspaceURL}),
    [tenant, workspace, workspaceURI, workspaceURL],
  );

  useEffect(() => {
    if (theme && theme.options && theme.id !== prevTheme.current) {
      updateTheme(theme?.options);
      prevTheme.current = theme.id;
    }
  }, [theme, updateTheme]);

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  return useContext(WorkspaceContext);
}

export default Workspace;
