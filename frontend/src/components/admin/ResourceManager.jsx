import { useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import Pagination from "@/components/ui/Pagination";
import EmptyState from "@/components/ui/EmptyState";
import { CardSkeleton } from "@/components/ui/Skeleton";
import DynamicForm from "./DynamicForm";
import ConfirmDialog from "./ConfirmDialog";
import { getErrorMessage } from "@/utils/helpers";

/**
 * Generic admin CRUD screen: searchable, paginated table + create/edit modal.
 *
 * @param {object} props
 * @param {string} props.title
 * @param {Array}  props.columns - [{ key, label, render?, badge? }]
 * @param {Array}  props.fields - DynamicForm field schema
 * @param {object} props.hooks - { useList, useCreate, useUpdate, useRemove }
 * @param {object} [props.listParams] - extra query params
 */
export default function ResourceManager({ title, subtitle, columns, fields, hooks, listParams = {} }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState({ open: false, item: null });
  const [confirm, setConfirm] = useState({ open: false, id: null });

  const { data, isLoading, isFetching } = hooks.useList({
    page,
    limit: 10,
    search: search || undefined,
    sort: "-createdAt",
    ...listParams,
  });
  const [createItem, createState] = hooks.useCreate();
  const [updateItem, updateState] = hooks.useUpdate();
  const [removeItem, removeState] = hooks.useRemove();

  const items = data?.data || [];
  const meta = data?.meta;

  const handleSubmit = async (values) => {
    try {
      if (modal.item) {
        await updateItem({ id: modal.item._id, ...values }).unwrap();
        toast.success(`${title} updated`);
      } else {
        await createItem(values).unwrap();
        toast.success(`${title} created`);
      }
      setModal({ open: false, item: null });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    try {
      await removeItem(confirm.id).unwrap();
      toast.success(`${title} deleted`);
      setConfirm({ open: false, id: null });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>
        <Button onClick={() => setModal({ open: true, item: null })}>
          <FiPlus /> Add {title}
        </Button>
      </div>

      <div className="relative max-w-sm">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder={`Search ${title.toLowerCase()}…`}
          className="input-field pl-10"
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title={`No ${title.toLowerCase()} yet`}
          message="Create your first entry to get started."
          action={<Button onClick={() => setModal({ open: true, item: null })}>Add {title}</Button>}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  {columns.map((c) => (
                    <th key={c.key} className="px-4 py-3 font-semibold text-slate-500">
                      {c.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right font-semibold text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    {columns.map((c) => (
                      <td key={c.key} className="px-4 py-3">
                        {c.render ? (
                          c.render(item)
                        ) : c.badge ? (
                          <Badge tone={c.badge(item[c.key])}>{item[c.key]}</Badge>
                        ) : (
                          <span className="line-clamp-1">{item[c.key]}</span>
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => setModal({ open: true, item })}
                          className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-500/10"
                          aria-label="Edit"
                        >
                          <FiEdit2 size={15} />
                        </button>
                        <button
                          onClick={() => setConfirm({ open: true, id: item._id })}
                          className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                          aria-label="Delete"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {meta && meta.totalPages > 1 && (
        <Pagination page={meta.page} totalPages={meta.totalPages} onChange={setPage} />
      )}

      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false, item: null })}
        title={`${modal.item ? "Edit" : "Add"} ${title}`}
        size="lg"
      >
        <DynamicForm
          fields={fields}
          initial={modal.item || {}}
          loading={createState.isLoading || updateState.isLoading}
          onSubmit={handleSubmit}
          onCancel={() => setModal({ open: false, item: null })}
        />
      </Modal>

      <ConfirmDialog
        open={confirm.open}
        loading={removeState.isLoading}
        onClose={() => setConfirm({ open: false, id: null })}
        onConfirm={handleDelete}
        message={`This will permanently delete this ${title.toLowerCase()}.`}
      />
    </div>
  );
}
