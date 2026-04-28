import ContactClient from "./contact-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Formix",
  description:
    "Get in touch with the Formix team for support, enterprise inquiries, or general questions about our headless form infrastructure.",
};

export default function ContactPage() {
  return <ContactClient />;
}
