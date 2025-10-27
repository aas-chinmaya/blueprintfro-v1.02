// app/page.js
'use client';

import ProjectList from '@/modules/project/ProjectList';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export default function Page() {
  const { currentUser } = useCurrentUser();

  

  const isAdmin = currentUser?.role === 'cpc' || currentUser?.position === 'Team Lead';

  return (
    <ProjectList
      mode={isAdmin ? 'all' : 'my'}
      employeeId={!isAdmin ? currentUser?.id : undefined}
      canCreate={isAdmin}
      canDelete={isAdmin}
    />
  );
}