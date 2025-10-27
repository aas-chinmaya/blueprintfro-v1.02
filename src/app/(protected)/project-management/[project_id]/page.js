





'use client';

import { use } from 'react';
import ProjectMainView from '@/modules/project/ProjectMainView';

export default function Page({ params }) {
  const resolvedParams = use(params); // Unwrap the params Promise
  return (
    <>
    
        <ProjectMainView projectId={resolvedParams.project_id} />
   
    </>
  );
}























