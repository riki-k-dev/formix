"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, ShieldCheck, UploadCloud } from "lucide-react";
import { uploadFiles } from "@/lib/uploadthing";

type FormField = {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "number"
    | "textarea"
    | "select"
    | "radio"
    | "checkbox"
    | "file";
  required: boolean;
  options?: string[];
};

type FormSchema = {
  name: string;
  description?: string;
  fields: FormField[];
};

export default function FormRenderer({
  formId,
  schema,
}: {
  formId: string;
  schema: FormSchema;
}) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [fileData, setFileData] = useState<Record<string, File>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileData({ ...fileData, [e.target.name]: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const finalFormData = { ...formData };

      // 1. Upload files first if any exist
      if (Object.keys(fileData).length > 0) {
        for (const [fieldName, file] of Object.entries(fileData)) {
          const uploadRes = await uploadFiles("formAttachmentUploader", {
            files: [file],
          });
          if (uploadRes && uploadRes.length > 0) {
            // Save the returned URL into the payload
            finalFormData[fieldName] = uploadRes[0].url;
          }
        }
      }

      // 2. Submit entire payload to Formix API
      const res = await fetch(`/api/v1/submit/${formId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: finalFormData }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit form");
      }

      setIsSuccess(true);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success Screen
  if (isSuccess) {
    return (
      <div className="bg-[#111] border border-neutral-800 p-8 rounded-xl max-w-md w-full text-center space-y-4 animate-in fade-in zoom-in-95 duration-300 shadow-2xl">
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-medium text-white tracking-tight">
          Success!
        </h2>
        <p className="text-neutral-400 text-sm">
          Your response has been securely recorded. You can now close this tab.
        </p>
      </div>
    );
  }

  // The Form Engine
  return (
    <div className="bg-[#111] border border-neutral-800 p-6 sm:p-8 rounded-xl max-w-lg w-full shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none flex items-center gap-1">
        <ShieldCheck size={14} />
        <span className="text-[10px] uppercase tracking-widest font-bold">
          Formix
        </span>
      </div>

      <div className="mb-8 border-b border-neutral-800/60 pb-6">
        <h1 className="text-2xl font-semibold text-white tracking-tight mb-2">
          {schema.name || "Untitled Form"}
        </h1>
        {schema.description && (
          <p className="text-neutral-400 text-sm leading-relaxed">
            {schema.description}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {schema.fields?.map((field: FormField, idx: number) => (
          <div key={idx} className="space-y-2">
            <label className="block text-sm font-medium text-neutral-300">
              {field.label}{" "}
              {field.required && <span className="text-red-400 ml-0.5">*</span>}
            </label>

            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                required={field.required}
                onChange={handleChange}
                placeholder={`Enter your ${field.label?.toLowerCase() || ""}`}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-200 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 transition-all min-h-25 resize-y placeholder:text-neutral-600"
              />
            ) : field.type === "select" ? (
              <select
                name={field.name}
                required={field.required}
                onChange={handleChange}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-200 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 transition-all appearance-none"
              >
                <option value="">Select an option...</option>
                {field.options?.map((opt: string, i: number) => (
                  <option key={i} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : field.type === "radio" ? (
              <div className="space-y-2.5 pt-1">
                {field.options?.map((opt, i) => (
                  <label
                    key={i}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name={field.name}
                      value={opt}
                      required={field.required}
                      onChange={handleChange}
                      className="w-4 h-4 border-neutral-700 bg-neutral-900 text-white focus:ring-white cursor-pointer accent-white"
                    />
                    <span className="text-sm text-neutral-400 group-hover:text-neutral-200 transition-colors">
                      {opt}
                    </span>
                  </label>
                ))}
              </div>
            ) : field.type === "checkbox" ? (
              <div className="flex items-center gap-3 pt-1 cursor-pointer group">
                <input
                  type="checkbox"
                  name={field.name}
                  required={field.required}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [field.name]: e.target.checked ? "Yes" : "No",
                    })
                  }
                  className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-white focus:ring-0 focus:ring-offset-0 cursor-pointer accent-white"
                />
                <span className="text-sm text-neutral-400 group-hover:text-neutral-200 transition-colors">
                  Select to confirm
                </span>
              </div>
            ) : field.type === "file" ? (
              <div className="relative group">
                <input
                  type="file"
                  name={field.name}
                  required={field.required}
                  onChange={handleFileChange}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-200 focus:outline-none file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-white file:text-black hover:file:bg-neutral-200 transition-all cursor-pointer"
                />
              </div>
            ) : (
              <input
                type={
                  field.type === "number"
                    ? "number"
                    : field.type === "email"
                      ? "email"
                      : "text"
                }
                name={field.name}
                required={field.required}
                onChange={handleChange}
                placeholder={`Enter your ${field.label?.toLowerCase() || ""}`}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-200 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 transition-all placeholder:text-neutral-600"
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-white text-black font-semibold py-3 rounded-lg mt-8 hover:bg-neutral-200 transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-white/5"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <UploadCloud size={18} />
              <span>Submit Form</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
