import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useUpdateMeMutation, useChangePasswordMutation } from "@/api/services/authApi";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import { getErrorMessage } from "@/utils/helpers";

/** Admin account settings: profile details + password change. */
export default function Settings() {
  const user = useSelector((s) => s.auth.user);
  const [updateMe, { isLoading: savingProfile }] = useUpdateMeMutation();
  const [changePassword, { isLoading: savingPassword }] = useChangePasswordMutation();

  const profileForm = useForm({ values: { name: user?.name || "", email: user?.email || "" } });
  const passwordForm = useForm({
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onProfile = async (values) => {
    try {
      await updateMe(values).unwrap();
      toast.success("Profile updated");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const onPassword = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }).unwrap();
      toast.success("Password changed");
      passwordForm.reset();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="max-w-2xl space-y-10">
      <SectionHeading eyebrow="Account" title="Settings" subtitle="Manage your admin account." align="left" />

      <form
        onSubmit={profileForm.handleSubmit(onProfile)}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Profile</h3>
        <Input label="Name" {...profileForm.register("name", { required: true })} />
        <Input label="Email" type="email" {...profileForm.register("email", { required: true })} />
        <div className="flex justify-end">
          <Button type="submit" loading={savingProfile}>
            Save profile
          </Button>
        </div>
      </form>

      <form
        onSubmit={passwordForm.handleSubmit(onPassword)}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Change password</h3>
        <Input label="Current password" type="password" {...passwordForm.register("currentPassword", { required: true })} />
        <Input label="New password" type="password" {...passwordForm.register("newPassword", { required: true, minLength: 8 })} />
        <Input label="Confirm new password" type="password" {...passwordForm.register("confirmPassword", { required: true })} />
        <div className="flex justify-end">
          <Button type="submit" loading={savingPassword}>
            Update password
          </Button>
        </div>
      </form>
    </div>
  );
}
