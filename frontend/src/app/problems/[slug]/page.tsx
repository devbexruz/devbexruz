import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { fetchProblemBySlug, ProblemItem } from "@/lib/api";
import ProblemDetailClient from "./ProblemDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

// Next.js Dynamic Metadata for Google & Yandex SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const problem = await fetchProblemBySlug(slug);

  if (!problem) {
    return {
      title: "Muammo Topilmadi — DevBexruz",
      description: "Qidirilayotgan muammo sahifasi mavjud emas.",
    };
  }

  const title = problem.effective_meta_title || `${problem.title} | DevBexruz Q&A`;
  const description = problem.effective_meta_description || problem.content_markdown.slice(0, 160);
  const keywords = problem.meta_keywords ? problem.meta_keywords.split(",").map(k => k.trim()) : ["Dev Q&A", "FastAPI", "PostgreSQL"];

  return {
    title: title,
    description: description,
    keywords: keywords,
    alternates: {
      canonical: `https://devbexruz.uz/problems/${problem.slug}`,
    },
    openGraph: {
      title: title,
      description: description,
      url: `https://devbexruz.uz/problems/${problem.slug}`,
      siteName: "DevBexruz Hamjamiyati",
      locale: "uz_UZ",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
    },
  };
}

export default async function ProblemDetailPage({ params }: Props) {
  const { slug } = await params;
  const problem = await fetchProblemBySlug(slug);

  if (!problem) {
    notFound();
  }

  // Schema.org QAPage JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    "mainEntity": {
      "@type": "Question",
      "name": problem.title,
      "text": problem.content_markdown.replace(/[#*`]/g, "").slice(0, 500),
      "answerCount": problem.solutions?.length || 0,
      "upvoteCount": problem.upvotes_count,
      "dateCreated": problem.created_at,
      "author": {
        "@type": "Person",
        "name": problem.author?.full_name || "Dasturchi"
      },
      ...(problem.solutions?.some(s => s.is_accepted) && {
        "acceptedAnswer": {
          "@type": "Answer",
          "text": problem.solutions.find(s => s.is_accepted)?.content_markdown.replace(/[#*`]/g, "").slice(0, 500),
          "upvoteCount": problem.solutions.find(s => s.is_accepted)?.upvotes_count || 1,
          "dateCreated": problem.solutions.find(s => s.is_accepted)?.created_at,
          "author": {
            "@type": "Person",
            "name": problem.solutions.find(s => s.is_accepted)?.author_name || "Bexruz Boynazarov"
          }
        }
      })
    }
  };

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ProblemDetailClient initialProblem={problem} />
    </>
  );
}
