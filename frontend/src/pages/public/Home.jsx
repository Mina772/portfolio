import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import SEO from "@/components/common/SEO";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Education from "@/components/sections/Education";
import Projects from "@/components/sections/Projects";
import Services from "@/components/sections/Services";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";
import { useGetAboutQuery } from "@/api/services/portfolioApi";

/** The single-page landing experience composed of all portfolio sections. */
export default function Home() {
  const { hash } = useLocation();
  const { data } = useGetAboutQuery();
  const about = data?.data;

  // Support deep-linking to a section via /#about etc.
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [hash]);

  const jsonLd = about
    ? {
        "@context": "https://schema.org",
        "@type": "Person",
        name: about.name,
        jobTitle: about.title,
        email: about.email,
        url: import.meta.env.VITE_SITE_URL,
        sameAs: (about.socialLinks || []).map((s) => s.url),
      }
    : undefined;

  return (
    <>
      <SEO
        title={about?.name}
        description={about?.seo?.metaDescription || about?.shortBio}
        keywords={about?.seo?.keywords}
        jsonLd={jsonLd}
      />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Education />
      <Projects />
      <Services />
      <Testimonials />
      <Contact />
    </>
  );
}
