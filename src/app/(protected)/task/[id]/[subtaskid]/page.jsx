"use client";

import SubTaskFullDetailsPage from "@/modules/Tasks/sub-task/SubTaskFullDetailsPage";
import { useParams } from "next/navigation";

export default function Page() {
  const { id, subtaskid } = useParams();


  return (
    <SubTaskFullDetailsPage task_id={id} subtask_id={subtaskid} />
 
  );
}
