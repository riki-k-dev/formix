import DocsClient from "./docs-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docs | Formix",
  description: "Documentation for Formix",
};

export default function DocsPage() {
  return <DocsClient />;
}
