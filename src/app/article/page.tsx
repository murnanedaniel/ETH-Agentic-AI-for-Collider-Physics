import type { Metadata } from "next";
import { Article } from "@/components/Article";

export const metadata: Metadata = {
  title: "Agentic AI for Collider Physics — the reading version",
  description: "The ETH Zürich talk as an interactive article: live scenes + spoken narration.",
};

export default function ArticlePage() {
  return <Article />;
}
