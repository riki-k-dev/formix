import { useState, useEffect } from "react";
import { Loader2, Sparkles, Shield, Inbox, Info } from "lucide-react";
import { toast } from "sonner";

type Activity = {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
};

export default function NotificationsTab() {
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoadingData(true);
      const res = await fetch("/api/user/preferences");
      if (res.ok) {
        const data = await res.json();
        setEmailNotifications(data.preferences.emailNotifications);
        setMarketingEmails(data.preferences.marketingEmails);
        setActivities(data.activities);
      }
    } catch (error) {
      console.error("Failed to fetch preferences", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleToggleEmail = async () => {
    const newValue = !emailNotifications;
    setEmailNotifications(newValue);
    await updatePreferences(newValue, marketingEmails);
  };

  const handleToggleMarketing = async () => {
    const newValue = !marketingEmails;
    setMarketingEmails(newValue);
    await updatePreferences(emailNotifications, newValue);
  };

  const updatePreferences = async (emailNotif: boolean, mktgEmail: boolean) => {
    try {
      const res = await fetch("/api/user/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailNotifications: emailNotif,
          marketingEmails: mktgEmail,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Preferences updated");
    } catch {
      toast.error("Failed to update preferences");
    }
  };

  const handleMarkAsRead = async (id: string) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a)),
    );
    try {
      await fetch("/api/user/activities", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    setActivities((prev) => prev.map((a) => ({ ...a, read: true })));
    toast.success("All notifications marked as read");
    try {
      await fetch("/api/user/activities", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_all" }),
      });
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = activities.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(activities.length / itemsPerPage);
  const unreadCount = activities.filter((a) => !a.read).length;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "success":
        return <Sparkles size={18} className="text-purple-400" />;
      case "warning":
        return <Shield size={18} className="text-amber-400" />;
      default:
        return <Inbox size={18} className="text-blue-400" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-purple-500/10";
      case "warning":
        return "bg-amber-500/10";
      default:
        return "bg-blue-500/10";
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center py-20 animate-in fade-in">
        <Loader2 size={24} className="text-neutral-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-neutral-800">
          <h2 className="text-lg font-medium text-white">Email Preferences</h2>
          <p className="text-xs text-neutral-500 mt-1">
            Choose what updates you want to receive.
          </p>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-medium text-neutral-200">
                New Form Submissions
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Receive an email whenever someone submits your form.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={emailNotifications}
                onChange={handleToggleEmail}
              />
              <div className="w-9 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>
          <div className="h-px w-full bg-neutral-800"></div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-medium text-neutral-200">
                Product Updates
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Get notified about new features and Formix updates.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={marketingEmails}
                onChange={handleToggleMarketing}
              />
              <div className="w-9 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-white">Recent Activity</h2>
            <p className="text-xs text-neutral-500 mt-1">
              Your latest notifications and account alerts.
            </p>
          </div>
          {activities.length > 0 && unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="divide-y divide-neutral-800/50">
          {activities.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center mb-3">
                <Info size={20} className="text-neutral-500" />
              </div>
              <p className="text-sm text-neutral-400">
                No recent activity yet.
              </p>
            </div>
          ) : (
            currentItems.map((notif) => (
              <div
                key={notif.id}
                onClick={() => !notif.read && handleMarkAsRead(notif.id)}
                className={`p-5 flex gap-4 transition-all duration-300 ${!notif.read ? "bg-neutral-900/10 hover:bg-neutral-900/30 cursor-pointer" : "opacity-50 grayscale-[20%] hover:opacity-100"}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getActivityColor(notif.type)}`}
                >
                  {getActivityIcon(notif.type)}
                </div>
                <div className="flex-1">
                  <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-1 sm:gap-4 mb-1">
                    <h3
                      className={`text-sm font-medium ${!notif.read ? "text-white" : "text-neutral-300"}`}
                    >
                      {notif.title}
                    </h3>
                    <span className="text-[10px] text-neutral-500 whitespace-nowrap">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p
                    className={`text-xs ${!notif.read ? "text-neutral-400" : "text-neutral-500"}`}
                  >
                    {notif.message}
                  </p>
                </div>
                {!notif.read && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                )}
              </div>
            ))
          )}
        </div>

        {activities.length > 0 && (
          <div className="p-4 px-6 text-center border-t border-neutral-800 flex items-center justify-between gap-4">
            <div className="text-xs text-neutral-400 whitespace-nowrap">
              Page {currentPage} of {Math.max(1, totalPages)} (
              {activities.length} total)
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="text-xs font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="text-xs font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
