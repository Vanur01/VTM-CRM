"use client";
import dynamic from "next/dynamic";
import { FC } from "react";

export type AllowedToken =
  | "firstName"
  | "lastName"
  | "fullName"
  | "email"
  | "company"
  | "phone"
  | "website"
  | "title"
  | "industry"
  | "leadSource"
  | "leadStatus"
  | "priority"
  | "status"
  | "address.full"
  | "ownerName";

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  theme?: "snow" | "bubble";
  allowedTokens?: AllowedToken[];
}

const QuillEditor = dynamic(() => import("./QuillEditor"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

const DynamicQuillEditor: FC<QuillEditorProps> = (props) => {
  return <QuillEditor {...props} />;
};

export default DynamicQuillEditor; 