"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getPublishedPosts, categories, type BlogPost } from "@/lib/blog";
import { Search, Calendar, User, ArrowRight, Tag } from "lucide-react";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    setPosts(getPublishedPosts());
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = !selectedCategory || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getCategoryName = (id: string) => {
    return categories.find((c) => c.id === id)?.name || id;
  };

  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-br from-primary/5 via-white to-secondary/5">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
              Полезные статьи
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Блог</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Полезные статьи о бухгалтерском учёте, налогах и ведении бизнеса.
              Актуальная информация и практические советы.
            </p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Поиск статей..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                Все статьи
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  {searchQuery || selectedCategory
                    ? "Статьи не найдены. Попробуйте изменить параметры поиска."
                    : "Статьи скоро появятся. Следите за обновлениями!"}
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="group overflow-hidden hover:shadow-lg transition-all">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {getCategoryName(post.category)}
                        </Badge>
                      </div>
                      <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </CardTitle>
                      <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {post.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(post.createdAt).toLocaleDateString("ru-RU")}
                        </div>
                      </div>
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {post.tags.slice(0, 3).map((tag) => (
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
                      <Button variant="ghost" className="w-full" asChild>
                        <Link href={`/blog/${post.slug}`}>
                          Читать далее
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Не нашли ответ на свой вопрос?</h2>
            <p className="text-muted-foreground mb-6">
              Обратитесь за бесплатной консультацией, и мы поможем разобраться в вашей ситуации.
            </p>
            <Button size="lg" asChild>
              <Link href="/contacts#form">
                Получить консультацию
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
