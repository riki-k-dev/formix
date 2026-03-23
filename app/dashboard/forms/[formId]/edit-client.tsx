"use client";

import { useState } from "react";
import {
  Save,
  Plus,
  Trash2,
  ArrowLeft,
  Loader2,
  GripVertical,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type FormField = {
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
};

type FormSchema = {
  name: string;
  description: string;
  fields: FormField[];
};

export default function EditFormClient({
  formId,
  initialSchema,
}: {
  formId: string;
  initialSchema: FormSchema;
}) {
  const router = useRouter();
  const [schema, setSchema] = useState<FormSchema>(initialSchema);
  const [isSaving, setIsSaving] = useState(false);

  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  const handleFieldChange = (
    index: number,
    key: keyof FormField,
    value: string | boolean,
  ) => {
    const updatedFields = [...schema.fields];
    updatedFields[index] = {
      ...updatedFields[index],
      [key]: value,
    } as FormField;

    if (
      key === "label" &&
      typeof value === "string" &&
      !updatedFields[index].name
    ) {
      updatedFields[index].name = value
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_");
    }

    setSchema({ ...schema, fields: updatedFields });
  };

  const removeField = (index: number) => {
    const fieldName = schema.fields[index].label || "Field";
    const updatedFields = schema.fields.filter((_, i) => i !== index);
    setSchema({ ...schema, fields: updatedFields });
    toast.success(`Removed "${fieldName}"`); // Modern Toast!
  };

  const addField = () => {
    setSchema({
      ...schema,
      fields: [
        ...schema.fields,
        {
          name: `new_field_${Date.now()}`,
          label: "New Field",
          type: "text",
          required: false,
        },
      ],
    });
    toast.success("New field added at the bottom");
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/forms/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formId,
          name: schema.name,
          description: schema.description,
          schema: schema,
        }),
      });

      if (!res.ok) throw new Error("Failed to save");

      toast.success("Form schema saved successfully!");
      router.refresh();
    } catch (error: unknown) {
      console.error("Form save error:", error);
      toast.error("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    index: number,
  ) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;

    const items = [...schema.fields];
    const draggedItem = items[draggedItemIndex];
    items.splice(draggedItemIndex, 1);
    items.splice(index, 0, draggedItem);

    setSchema({ ...schema, fields: items });
    setDraggedItemIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 bg-neutral-900 border border-neutral-800 rounded-md hover:bg-neutral-800 transition-colors text-neutral-400"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-mono tracking-tight text-white mb-1">
              Edit Form Schema
            </h1>
            <p className="text-neutral-500 text-sm font-mono">ID: {formId}</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 bg-white text-black font-medium text-sm rounded-md hover:bg-neutral-200 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Save Changes
        </button>
      </div>

      <div className="space-y-8">
        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-medium text-white border-b border-neutral-800 pb-3 mb-4">
            General Info
          </h2>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1.5">
              Form Name
            </label>
            <input
              type="text"
              value={schema.name}
              onChange={(e) => setSchema({ ...schema, name: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-200 focus:outline-none focus:border-neutral-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1.5">
              Description
            </label>
            <textarea
              value={schema.description}
              onChange={(e) =>
                setSchema({ ...schema, description: e.target.value })
              }
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-200 focus:outline-none focus:border-neutral-600 min-h-20"
            />
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-6">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-6">
            <h2 className="text-lg font-medium text-white">Form Fields</h2>
            <button
              onClick={addField}
              className="px-3 py-1.5 bg-neutral-800 text-white text-xs font-medium rounded hover:bg-neutral-700 transition-colors flex items-center gap-1.5"
            >
              <Plus size={14} /> Add Field
            </button>
          </div>

          <div className="space-y-4">
            {schema.fields.map((field, index) => (
              <div
                key={`${field.name}_${index}`} // Added unique key for drag rendering
                draggable // Enabled dragging
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`flex items-start gap-4 p-4 bg-neutral-900/50 border border-neutral-800 rounded-lg group hover:border-neutral-700 transition-colors ${draggedItemIndex === index ? "opacity-50 border-dashed border-neutral-500" : ""}`}
              >
                <div className="pt-2 text-neutral-600 cursor-grab active:cursor-grabbing hover:text-neutral-400 transition-colors">
                  <GripVertical size={18} />
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">
                      Field Label
                    </label>
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) =>
                        handleFieldChange(index, "label", e.target.value)
                      }
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-neutral-600"
                      placeholder="e.g. Full Name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">
                      Data Key (JSON Name)
                    </label>
                    <input
                      type="text"
                      value={field.name}
                      onChange={(e) =>
                        handleFieldChange(index, "name", e.target.value)
                      }
                      className="w-full bg-black border border-neutral-800 rounded-md px-3 py-2 text-sm text-neutral-400 font-mono focus:outline-none focus:border-neutral-600"
                    />
                  </div>

                  <div className="flex items-center gap-4 md:col-span-2 mt-2">
                    <div className="flex-1 max-w-50">
                      <select
                        value={field.type}
                        onChange={(e) =>
                          handleFieldChange(index, "type", e.target.value)
                        }
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm text-neutral-200 focus:outline-none appearance-none"
                      >
                        <option value="text">Short Text</option>
                        <option value="textarea">Long Text</option>
                        <option value="email">Email</option>
                        <option value="number">Number</option>
                        <option value="select">Dropdown</option>
                      </select>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer text-sm text-neutral-300">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) =>
                          handleFieldChange(index, "required", e.target.checked)
                        }
                        className="rounded border-neutral-800 bg-neutral-900 text-white focus:ring-0"
                      />
                      Required Field
                    </label>

                    <button
                      onClick={() => removeField(index)}
                      className="ml-auto p-2 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                      title="Delete Field"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {schema.fields.length === 0 && (
              <div className="text-center py-10 border border-dashed border-neutral-800 rounded-lg text-neutral-500 text-sm">
                No fields left. Add a new field to continue.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
