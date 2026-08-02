import { useForm } from "react-hook-form";
import { Input, Textarea, Select } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { toArray } from "@/utils/helpers";

/**
 * Schema-driven form used by the admin resource manager.
 * Field types: text, number, textarea, select, checkbox, array, date, color, url.
 *
 * @param {{fields: Array, initial?: object, onSubmit: Function, onCancel: Function, loading?: boolean}} props
 */
export default function DynamicForm({ fields, initial = {}, onSubmit, onCancel, loading }) {
  // Prepare default values, converting arrays back to comma text for inputs.
  const defaults = fields.reduce((acc, f) => {
    let v = initial[f.name];
    if (f.type === "array" && Array.isArray(v)) v = v.join(", ");
    if (f.type === "date" && v) v = new Date(v).toISOString().slice(0, 10);
    if (f.type === "image" && v && typeof v === "object") v = v.url || "";
    acc[f.name] = v ?? f.default ?? (f.type === "checkbox" ? false : "");
    return acc;
  }, {});

  const { register, handleSubmit } = useForm({ defaultValues: defaults });

  const submit = (values) => {
    const payload = {};
    fields.forEach((f) => {
      let v = values[f.name];
      if (f.type === "array") v = toArray(v);
      else if (f.type === "number") v = v === "" ? undefined : Number(v);
      else if (f.type === "checkbox") v = Boolean(v);
      else if (f.type === "image") v = v ? { url: v } : undefined;
      payload[f.name] = v;
    });
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => {
          const span = f.full ? "sm:col-span-2" : "";
          if (f.type === "checkbox") {
            return (
              <label key={f.name} className={`flex items-center gap-3 ${span}`}>
                <input type="checkbox" {...register(f.name)} className="h-5 w-5 rounded accent-brand-600" />
                <span className="text-sm font-medium">{f.label}</span>
              </label>
            );
          }
          if (f.type === "textarea") {
            return (
              <div key={f.name} className={span}>
                <Textarea label={f.label} rows={f.rows || 4} placeholder={f.placeholder} {...register(f.name)} />
                {f.help && <p className="mt-1 text-xs text-slate-400">{f.help}</p>}
              </div>
            );
          }
          if (f.type === "select") {
            return (
              <div key={f.name} className={span}>
                <Select label={f.label} {...register(f.name)}>
                  {(f.options || []).map((o) => {
                    const value = typeof o === "string" ? o : o.value;
                    const label = typeof o === "string" ? o : o.label;
                    return (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    );
                  })}
                </Select>
              </div>
            );
          }
          return (
            <div key={f.name} className={span}>
              <Input
                label={f.label}
                type={["array", "image"].includes(f.type) ? "text" : f.type || "text"}
                step={f.type === "number" ? "any" : undefined}
                placeholder={f.placeholder}
                {...register(f.name)}
              />
              {f.help && <p className="mt-1 text-xs text-slate-400">{f.help}</p>}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Save
        </Button>
      </div>
    </form>
  );
}
