import { useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetMessagesQuery,
  useUpdateMessageStatusMutation,
  useDeleteMessageMutation,
} from "@/api/services/portfolioApi";
import Spinner from "@/components/ui/Spinner";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import SectionHeading from "@/components/ui/SectionHeading";
import { formatDateTime } from "@/utils/helpers";
import { FiMail, FiTrash2, FiStar, FiCheck, FiCornerUpLeft } from "react-icons/fi";

const statusTone = { unread: "brand", read: "muted", replied: "success", archived: "warning" };
const FILTERS = ["all", "unread", "read", "replied", "archived"];

export default function MessagesManager() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [active, setActive] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const params = { page, limit: 10, sort: "-createdAt" };
  if (status !== "all") params.status = status;

  const { data, isLoading, isFetching } = useGetMessagesQuery(params);
  const [updateStatus] = useUpdateMessageStatusMutation();
  const [deleteMessage, { isLoading: deleting }] = useDeleteMessageMutation();

  const messages = data?.data || [];
  const meta = data?.meta || {};

  const open = async (msg) => {
    setActive(msg);
    if (msg.status === "unread") {
      try {
        await updateStatus({ id: msg._id, status: "read" }).unwrap();
      } catch {
        /* silent */
      }
    }
  };

  const setMsgStatus = async (id, next) => {
    try {
      await updateStatus({ id, status: next }).unwrap();
      toast.success(`Marked as ${next}`);
      setActive((a) => (a && a._id === id ? { ...a, status: next } : a));
    } catch (err) {
      toast.error(err?.data?.message || "Failed");
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteMessage(toDelete._id).unwrap();
      toast.success("Message deleted");
      if (active && active._id === toDelete._id) setActive(null);
      setToDelete(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Inbox" title="Messages" subtitle="Enquiries submitted through the contact form." align="left" />

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => {
              setStatus(f);
              setPage(1);
            }}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
              status === f
                ? "bg-brand-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : messages.length === 0 ? (
        <EmptyState icon={FiMail} title="No messages" message="New contact enquiries will appear here." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
          <div className={`space-y-3 ${isFetching ? "opacity-60" : ""}`}>
            {messages.map((msg) => (
              <button
                key={msg._id}
                onClick={() => open(msg)}
                className={`w-full rounded-xl border p-4 text-left transition hover:border-brand-400 ${
                  active?._id === msg._id
                    ? "border-brand-500 bg-brand-50/50 dark:bg-brand-500/10"
                    : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                } ${msg.status === "unread" ? "font-semibold" : ""}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate">{msg.name}</span>
                  <Badge tone={statusTone[msg.status]}>{msg.status}</Badge>
                </div>
                <p className="mt-1 truncate text-sm text-slate-500">{msg.subject}</p>
                <p className="mt-1 text-xs text-slate-400">{formatDateTime(msg.createdAt)}</p>
              </button>
            ))}
            <Pagination page={meta.page || page} totalPages={meta.totalPages || 1} onChange={setPage} />
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <AnimatePresence mode="wait">
              {active ? (
                <motion.div
                  key={active._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{active.subject}</h3>
                      <p className="text-sm text-slate-500">
                        {active.name} ·{" "}
                        <a href={`mailto:${active.email}`} className="text-brand-500 hover:underline">
                          {active.email}
                        </a>
                      </p>
                      {active.company && <p className="text-xs text-slate-400">{active.company}</p>}
                    </div>
                    <Badge tone={statusTone[active.status]}>{active.status}</Badge>
                  </div>

                  <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {active.message}
                  </p>

                  <p className="mt-4 text-xs text-slate-400">Received {formatDateTime(active.createdAt)}</p>

                  <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                    <Button as="a" href={`mailto:${active.email}?subject=Re: ${encodeURIComponent(active.subject)}`} size="sm">
                      <FiCornerUpLeft className="mr-1" /> Reply
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setMsgStatus(active._id, "replied")}>
                      <FiCheck className="mr-1" /> Mark replied
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setMsgStatus(active._id, "archived")}>
                      <FiStar className="mr-1" /> Archive
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => setToDelete(active)}>
                      <FiTrash2 className="mr-1" /> Delete
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <div className="flex h-full min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-slate-300 text-slate-400 dark:border-slate-700">
                  Select a message to read
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Delete message"
        message="This message will be permanently removed."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
      />
    </div>
  );
}
