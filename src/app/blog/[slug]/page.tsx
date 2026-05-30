"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getPostBySlug, getPublishedPosts, categories, type BlogPost } from "@/lib/blog";
import { Calendar, User, ArrowLeft, ArrowRight, Tag, Share2 } from "lucide-react";
import { toast } from "sonner";

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const slug = params.slug as string;
    const foundPost = getPostBySlug(slug);
    setPost(foundPost || null);

    if (foundPost) {
      const allPosts = getPublishedPosts();
      const related = allPosts
        .filter((p) => p.id !== foundPost.id && p.category === foundPost.category)
        .slice(0, 3);
      setRelatedPosts(related);
    }

    setIsLoading(false);
  }, [params.slug]);

  const getCategoryName = (id: string) => {
    return categories.find((c) => c.id === id)?.name || id;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt,
          url: window.location.href,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Ссылка скопирована в буфер обмена");
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="flex-1 py-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground">Загрузка...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Header />
        <main className="flex-1 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Статья не найдена</h1>
            <p className="text-muted-foreground mb-6">
              К сожалению, запрашиваемая статья не существует.
            </p>
            <Button asChild>
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Вернуться в блог
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-12 bg-gradient-to-br from-primary/5 via-white to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Button variant="ghost" asChild className="mb-6">
                <Link href="/blog">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Все статьи
                </Link>
              </Button>

              <Badge className="mb-4">{getCategoryName(post.category)}</Badge>

              <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {post.author}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.createdAt).toLocaleDateString("ru-RU", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-1" />
                  Поделиться
                </Button>
              </div>

              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center text-xs bg-muted px-2 py-1 rounded"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Featured Image */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <img
                src={post.image}
                alt={post.title}
                className="w-full rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <article className="prose prose-lg max-w-none">
                {post.content.split("\n").map((paragraph, index) => {
                  if (paragraph.startsWith("# ")) {
                    return (
                      <h1 key={index} className="text-3xl font-bold mt-8 mb-4">
                        {paragraph.replace("# ", "")}
                      </h1>
                    );
                  }
                  if (paragraph.startsWith("## ")) {
                    return (
                      <h2 key={index} className="text-2xl font-bold mt-6 mb-3">
                        {paragraph.replace("## ", "")}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith("### ")) {
                    return (
                      <h3 key={index} className="text-xl font-semibold mt-4 mb-2">
                        {paragraph.replace("### ", "")}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith("- ")) {
                    return (
                      <li key={index} className="ml-4">
                        {paragraph.replace("- ", "")}
                      </li>
                    );
                  }
                  if (paragraph.match(/^\d+\. /)) {
                    return (
                      <li key={index} className="ml-4">
                        {paragraph.replace(/^\d+\. /, "")}
                      </li>
                    );
                  }
                  if (paragraph.trim() === "") {
                    return <br key={index} />;
                  }
                  return (
                    <p key={index} className="mb-4 text-muted-foreground">
                      {paragraph}
                    </p>
                  );
                })}
              </article>

              {/* CTA */}
              <Card className="mt-12 bg-primary text-primary-foreground">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4">Нужна помощь с бухгалтерией?</h3>
                  <p className="text-white/80 mb-6">
                    Обратитесь за бесплатной консультацией, и мы поможем решить ваши вопросы.
                  </p>
                  <Button size="lg" variant="secondary" asChild>
                    <Link href="/contacts#form">
                      Получить консультацию
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-8 text-center">Похожие статьи</h2>
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {relatedPosts.map((related) => (
                  <Card key={related.id} className="hover:shadow-lg transition-shadow">
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={related.image}
                        alt={related.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-2">
                        <Link href={`/blog/${related.slug}`} className="hover:text-primary">
                          {related.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
