import { Helmet } from "react-helmet-async";
import { SITE_URL } from "@/constants";

/**
 * Centralized SEO component: title, description, canonical,
 * Open Graph, Twitter cards and optional JSON-LD structured data.
 */
export default function SEO({
  title,
  description = "Premium full-stack developer portfolio built with the MERN stack.",
  image = "/og-image.png",
  path = "",
  type = "website",
  keywords = [],
  jsonLd,
}) {
  const fullTitle = title ? `${title} | Portfolio` : "Portfolio | Full Stack Engineer";
  const url = `${SITE_URL}${path}`;
  const absoluteImage = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(", ")} />}
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={absoluteImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />

      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}
