"use client";

import Input from "@/shared/ui/atoms/Input/ui/Input";

interface TextInputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export default function TextInputField({ label, placeholder, value, onChange }: TextInputFieldProps) {
  return (
    <>
      <h1>{label}</h1>
      <Input placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
    </>
  );
}
