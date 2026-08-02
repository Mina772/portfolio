import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiClock, FiArrowRight } from "react-icons/fi";
import SEO from "@/components/common/SEO";
import SectionHeading from "@/components/ui/SectionHeading";
import Badge from "@/components/ui/Badge";
import { CardSkeleton } from "@/components/ui/Skeleton";
import Pagination from "@/components/ui/Pagination";
import EmptyState from "@/components/ui/EmptyState";
import { useGetPostsQuery } from "@/api/services/portfolioApi";
import { resolveAsset, formatDate, truncate } from "@/utils/helpers";
import { fadeInUp, staggerContainer } from "@/animations/variants";

/** Public blog index with pagination and search. */
export default function BlogList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, isFetching } = useGetPostsQuery({ page, limit: 9, search: search || undefined });
  const posts = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="container-app pt-28 pb-20">
      <SEO title="Blog" description="Articles on web development, architecture and engineering." path="/blog" />
      <SectionHeading eyebrow="Blog" title="Latest Articles" subtitle="Thoughts on engineering, architecture and building products." />

      <div className="mt-8 flex justify-center">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search articles…"
          className="input-field max-w-md"
        />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {isFetching
          ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
          : posts.map((post) => (
              <motion.article
                key={post._id}
                variants={fadeInUp}
                className="card group flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-glow"
              >
                <Link to={`/blog/${post.slug}`} className="overflow-hidden">
                  <img
                    src={resolveAsset(post.coverImage, "https://picsum.photos/seed/post/800/500")}
                    alt={post.title}
                    className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </Link>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Badge tone="brand">{post.category}</Badge>
                    <span className="flex items-center gap-1">
                      <FiClock size={12} /> {post.readTime} min
                    </span>
                    <span className="ml-auto">{formatDate(post.publishedAt || post.createdAt)}</span>
                  </div>
                  <Link to={`/blog/${post.slug}`}>
                    <h3 className="mt-3 font-display text-lg font-semibold group-hover:text-brand-600">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="mt-2 flex-1 text-sm text-slate-500 dark:text-slate-400">
                    {truncate(post.excerpt, 120)}
                  </p>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600"
                  >
                    Read more <FiArrowRight />
                  </Link>
                </div>
              </motion.article>
            ))}
      </motion.div>

      {!isFetching && posts.length === 0 && (
        <div className="mt-10">
          <EmptyState title="No articles yet" message="Check back soon for new posts." />
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="mt-12">
          <Pagination page={meta.page} totalPages={meta.totalPages} onChange={setPage} />
        </div>
      )}
    </div>
  );
}
