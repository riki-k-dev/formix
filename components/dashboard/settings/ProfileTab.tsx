import { useState, useRef } from "react";
import { Mail, Shield, Check, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUploadThing } from "@/lib/uploadthing";

type ProfileTabProps = {
  user: { id: string; name: string; email: string; image?: string | null };
  onDeleteRequest: () => void;
};

export default function ProfileTab({ user, onDeleteRequest }: ProfileTabProps) {
  const router = useRouter();
  const [name, setName] = useState(user.name || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { startUpload } = useUploadThing("avatarUploader", {
    onClientUploadComplete: () => {
      toast.success("Avatar updated successfully!");
      setIsUploading(false);
      router.refresh();
    },
    onUploadError: (error) => {
      toast.error(error.message || "Failed to upload avatar");
      setIsUploading(false);
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    await startUpload(Array.from(e.target.files));
  };

  const handleRemoveAvatar = async () => {
    setIsUploading(true);
    try {
      const res = await fetch("/api/user/avatar", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove avatar");
      toast.success("Avatar removed successfully!");
      router.refresh();
    } catch {
      toast.error("Failed to remove avatar");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      toast.success("Profile updated successfully!");
      router.refresh();
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (userName: string) => {
    return userName ? userName.charAt(0).toUpperCase() : "U";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-neutral-800">
          <h2 className="text-lg font-medium text-white">Profile Details</h2>
          <p className="text-xs text-neutral-500 mt-1">
            Update your personal information.
          </p>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-2xl font-bold text-white uppercase overflow-hidden shrink-0">
              {user.image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={user.image}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitials(user.name)
              )}
            </div>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg, image/gif, image/png"
                className="hidden"
              />
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-3 py-1.5 bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs font-medium rounded hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isUploading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : null}
                  {isUploading ? "Processing..." : "Upload new avatar"}
                </button>
                {/* Remove Avatar Button Added Here */}
                {user.image && (
                  <button
                    onClick={handleRemoveAvatar}
                    disabled={isUploading}
                    className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium rounded hover:bg-red-500/20 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Remove
                  </button>
                )}
              </div>
              <p className="text-[10px] text-neutral-500 mt-2">
                JPG, GIF or PNG. Max size of 2MB.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
                />
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full bg-black border border-neutral-800 rounded-md pl-9 pr-3 py-2 text-sm text-neutral-500 cursor-not-allowed"
                />
              </div>
              <p className="text-[10px] text-neutral-500 mt-1.5 flex items-center gap-1">
                <Shield size={10} /> Email is managed by BetterAuth.
              </p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-neutral-900/30 border-t border-neutral-800 flex justify-end">
          <button
            onClick={handleSaveProfile}
            disabled={isSaving || !name}
            className="px-5 py-2 bg-white text-black font-medium text-sm rounded-md hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Check size={16} />
            )}{" "}
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-transparent border border-neutral-800 rounded-xl overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
        <div>
          <h3 className="text-base font-medium text-white">Delete account</h3>
          <p className="text-sm text-neutral-500 mt-1">
            Cancels your subscription and removes all data permanently
          </p>
        </div>
        <button
          onClick={onDeleteRequest}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/30 transition-colors text-sm font-medium shrink-0 cursor-pointer"
        >
          Delete <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
