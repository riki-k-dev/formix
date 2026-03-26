import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient();

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteAccountModal({
  isOpen,
  onClose,
}: DeleteAccountModalProps) {
  const router = useRouter();
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  if (!isOpen) return null;

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") return;
    setIsDeletingAccount(true);
    try {
      const res = await fetch("/api/user/account", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete account");
      toast.success("Account permanently deleted. Goodbye!");
      await authClient.signOut({
        fetchOptions: { onSuccess: () => router.push("/") },
      });
    } catch (error: unknown) {
      const err =
        error instanceof Error ? error.message : "Failed to delete account";
      toast.error(err);
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0a0a0a] border border-red-500/20 rounded-xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col p-6 relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} className="text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">
              Delete your account
            </h3>
            <p className="text-sm text-red-400">This action is irreversible.</p>
          </div>
        </div>
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-4 mb-6">
          <ul className="text-sm text-neutral-400 space-y-2 list-disc pl-4">
            <li>
              All your <strong className="text-neutral-200">Forms</strong> and{" "}
              <strong className="text-neutral-200">Submissions</strong> will be
              wiped.
            </li>
            <li>
              Your <strong className="text-neutral-200">API Keys</strong> will
              immediately stop working.
            </li>
            <li>Your subscription will be cancelled immediately.</li>
          </ul>
        </div>
        <div className="mb-6">
          <label className="block text-sm text-neutral-300 mb-2">
            Type <strong className="text-white select-none">DELETE</strong> to
            confirm.
          </label>
          <input
            type="text"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            placeholder="DELETE"
            className="w-full bg-black border border-neutral-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-neutral-700"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              onClose();
              setDeleteConfirmation("");
            }}
            disabled={isDeletingAccount}
            className="flex-1 px-4 py-2.5 bg-transparent text-white border border-neutral-800 rounded-md text-sm hover:bg-neutral-900 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteAccount}
            disabled={isDeletingAccount || deleteConfirmation !== "DELETE"}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium text-sm rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:bg-neutral-800 disabled:text-neutral-500"
          >
            {isDeletingAccount ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Permanently Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
