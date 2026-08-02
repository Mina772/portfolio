import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiSend, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";
import { Input, Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useSendMessageMutation, useGetAboutQuery } from "@/api/services/portfolioApi";
import { getErrorMessage } from "@/utils/helpers";
import { slideInLeft, slideInRight, viewportOnce } from "@/animations/variants";

const schema = yup.object({
  name: yup.string().required("Name is required").min(2),
  email: yup.string().required("Email is required").email("Enter a valid email"),
  subject: yup.string().required("Subject is required").min(2),
  message: yup.string().required("Message is required").min(10, "Message is too short"),
});

/** Contact section with a validated form and dynamic contact details. */
export default function Contact() {
  const { data } = useGetAboutQuery();
  const about = data?.data || {};
  const [sendMessage, { isLoading }] = useSendMessageMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (values) => {
    try {
      await sendMessage(values).unwrap();
      toast.success("Message sent! I'll get back to you soon.");
      reset();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const details = [
    { icon: FiMail, label: "Email", value: about.email, href: `mailto:${about.email}` },
    { icon: FiPhone, label: "Phone", value: about.phone, href: `tel:${about.phone}` },
    { icon: FiMapPin, label: "Location", value: about.location },
  ].filter((d) => d.value);

  return (
    <section id="contact" className="section bg-slate-50 dark:bg-slate-900/40">
      <div className="container-app">
        <SectionHeading
          eyebrow="Contact"
          title="Let's build something great"
          subtitle="Have a project in mind or just want to say hi? My inbox is always open."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="space-y-6"
          >
            <p className="text-slate-500 dark:text-slate-400">
              Whether you have a question, a project, or an opportunity, feel free to reach out.
              I typically respond within 24 hours.
            </p>
            <div className="space-y-4">
              {details.map((d) => (
                <a
                  key={d.label}
                  href={d.href || "#"}
                  className="flex items-center gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-colors hover:border-brand-500"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-100 dark:bg-brand-500/15 text-brand-600">
                    <d.icon size={20} />
                  </span>
                  <div>
                    <div className="text-xs text-slate-400">{d.label}</div>
                    <div className="font-medium">{d.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          <motion.form
            variants={slideInRight}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            onSubmit={handleSubmit(onSubmit)}
            className="card space-y-4 p-6 sm:p-8"
            noValidate
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Name" placeholder="Jane Doe" {...register("name")} error={errors.name?.message} />
              <Input
                label="Email"
                type="email"
                placeholder="jane@example.com"
                {...register("email")}
                error={errors.email?.message}
              />
            </div>
            <Input label="Subject" placeholder="Project inquiry" {...register("subject")} error={errors.subject?.message} />
            <Textarea
              label="Message"
              rows={5}
              placeholder="Tell me about your project…"
              {...register("message")}
              error={errors.message?.message}
            />
            <Button type="submit" size="lg" loading={isLoading} className="w-full">
              Send message <FiSend />
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
