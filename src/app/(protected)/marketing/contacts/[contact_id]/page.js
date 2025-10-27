'use client';

import { useParams } from "next/navigation";
import ContactDetails from "@/modules/marketing/contact/ContactDetails";

export default function Contact() {
  const { contact_id } = useParams(); // get contact_id from URL

  return (
    <div className="">
      <ContactDetails contactId={contact_id} />
    </div>
  );
}
