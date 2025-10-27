'use client';

import CpcTeamList from '@/modules/Teams/CpcTeamList';
import TeamListByEmployeeId from '@/modules/Teams/TeamListByEmployeeId';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export default function AllTeamByRole() {

const {currentUser}=useCurrentUser()

  return (
    <div className="">
      {currentUser?.role === "cpc"|| currentUser?.position === "Team Lead" ? (
        <CpcTeamList   />
      ) : (
        <TeamListByEmployeeId  />
      )}



    
    </div>
  );
}