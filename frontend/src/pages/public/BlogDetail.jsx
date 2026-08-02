import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FiArrowLeft, FiClock } from "react-icons/fi";
import SEO from "@/components/common/SEO";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import PageLoader from "@/components/common/PageLoader";
import EmptyState from "@/components/ui/EmptyState";
import { useGetPostQuery } from "@/api/services/portfolioApi";
import { resolveAsset, formatDate } from "@/utils/helpers";

/** Single blog article rendered from markdown. */
export default function BlogDetail() {
  const { slug } = useParams();
  const { data, isLoading, isError } = useGetPostQuery(slug);
  const post = data?.data;

  if (isLoading) return <PageLoader />;
  if (isError || !post)
    return (
      <div className="container-app pt-32 pb-20">
        <EmptyState
          title="Article not found"
          action={
            <Button as={Link} to="/blog">
              Back to blog
            </Button>
          }
        />
      </div>
    );

  return (
    <article className="pt-24 pb-20">
      <SEO
        title={post.seo?.metaTitle || post.title}
        description={post.seo?.metaDescription || post.excerpt}
        image={resolveAsset(post.coverImage)}
        type="article"
        path={`/blog/${post.slug}`}
        keywords={post.tags}
      />
      <div className="container-app max-w-3xl">
        <Button as={Link} to="/blog" variant="ghost" size="sm" className="mb-6">
          <FiArrowLeft /> Back to blog
        </Button>

        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
          <Badge tone="brand">{post.category}</Badge>
          <span className="flex items-center gap-1">
            <FiClock size={13} /> {post.readTime} min read
          </span>
          <span>{formatDate(post.publishedAt || post.createdAt)}</span>
        </div>

        <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">{post.title}</h1>

        {post.author && (
          <div className="mt-5 flex items-center gap-3">
            <img
              src={resolveAsset(
                post.author.avatar,
                `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name || "A")}&background=6366f1&color=fff`
              )}
              alt={post.author.name}
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className="text-sm font-medium">{post.author.name}</span>
          </div>
        )}

        {post.coverImage?.url && (
          <img
            src={resolveAsset(post.coverImage)}
            alt={post.title}
            className="mt-8 w-full rounded-3xl border border-slate-200 dark:border-slate-800 object-cover"
          />
        )}

        <div className="prose prose-slate dark:prose-invert mt-10 max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>

        {post.tags?.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2 border-t border-slate-200 dark:border-slate-800 pt-6">
            {post.tags.map((t) => (
              <Badge key={t} tone="gray">
                #{t}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
