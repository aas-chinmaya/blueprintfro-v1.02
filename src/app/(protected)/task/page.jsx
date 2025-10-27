'use client';

import CpcTaskList from '@/modules/Tasks/task/CpcTaskList';
import EmployeeTaskList from '@/modules/Tasks/task/EmployeeTaskList';
import { useCurrentUser } from '@/hooks/useCurrentUser';





export default function AllTaskListByRole() {
  const { currentUser} = useCurrentUser();


  return (
    <div className="">
      {currentUser?.role === "cpc"|| currentUser?.position === "Team Lead"? (
        <CpcTaskList  currentUser={currentUser} />
      ) : (
        <EmployeeTaskList  currentUser={currentUser} />
      )}
    </div>
  );
}