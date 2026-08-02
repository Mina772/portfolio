import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

/** Reusable confirmation dialog for destructive actions. */
export default function ConfirmDialog({ open, onClose, onConfirm, loading, title = "Are you sure?", message, confirmLabel = "Delete" }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {message || "This action cannot be undone."}
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" loading={loading} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
