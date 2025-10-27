

// 'use client';

// import FetchAllProjects from "@/modules/project/FetchAllProjects";
// import MyWorkedProject from "@/modules/project/MyWorkedProject";
// // import { useLoggedinUser } from "@/hooks/useLoggedinUser";
// import { useCurrentUser } from "@/hooks/useCurrentUser";

// export default function Page() {
//   const { currentUser, loading } = useCurrentUser();
// // console.log(currentUser);

//   return (
//     <div className="px-4 lg:px-6">
//       {currentUser?.role === "cpc"|| currentUser?.position === "Team Lead"? <FetchAllProjects /> : <MyWorkedProject employeeId={currentUser?.id} />}
//     </div>
//   );
// }


// app/page.js (or wherever your page is)




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