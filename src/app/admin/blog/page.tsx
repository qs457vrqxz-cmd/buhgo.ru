"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  getPosts,
  savePosts,
  createPost,
  updatePost,
  deletePost,
  generateSlug,
  categories,
  type BlogPost,
} from "@/lib/blog";
import {
  Plus,
  Pencil,
  Trash2,
  MoreVertical,
  Eye,
  EyeOff,
  Save,
  X,
} from "lucide-react";
import Link from "next/link";

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "nalogi",
    image: "",
    tags: "",
    published: true,
  });

  useEffect(() => {
    setPosts(getPosts());
  }, []);

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "nalogi",
      image: "",
      tags: "",
      published: true,
    });
    setEditingPost(null);
    setIsEditing(false);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      image: post.image,
      tags: post.tags.join(", "),
      published: post.published,
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Вы уверены, что хотите удалить эту статью?")) {
      deletePost(id);
      setPosts(getPosts());
      toast.success("Статья удалена");
    }
  };

  const handleTogglePublish = (post: BlogPost) => {
    updatePost(post.id, { published: !post.published });
    setPosts(getPosts());
    toast.success(post.published ? "Статья снята с публикации" : "Статья опубликована");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      toast.error("Заполните обязательные поля");
      return;
    }

    const postData = {
      title: formData.title,
      slug: generateSlug(formData.title),
      excerpt: formData.excerpt || formData.content.substring(0, 150) + "...",
      content: formData.content,
      category: formData.category,
      image: formData.image || "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop",
      author: "Михаил Кузьмин",
      tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
      published: formData.published,
      createdAt: editingPost?.createdAt || new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };

    if (isEditing && editingPost) {
      updatePost(editingPost.id, postData);
      toast.success("Статья обновлена");
    } else {
      createPost(postData);
      toast.success("Статья создана");
    }

    setPosts(getPosts());
    setIsDialogOpen(false);
    resetForm();
  };

  const getCategoryName = (id: string) => {
    return categories.find((c) => c.id === id)?.name || id;
  };

  return (
    <>
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Управление блогом</h1>
              <p className="text-muted-foreground">
                Создавайте и редактируйте статьи для блога
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Новая статья
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {isEditing ? "Редактирование статьи" : "Новая статья"}
                  </DialogTitle>
                  <DialogDescription>
                    Заполните поля для создания или редактирования статьи
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Заголовок *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Введите заголовок статьи"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Краткое описание</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="Краткое описание для превью"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Содержание *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Текст статьи (поддерживается Markdown)"
                      rows={12}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Поддерживается: # Заголовок, ## Подзаголовок, - Список
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Категория</Label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image">URL изображения</Label>
                      <Input
                        id="image"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Теги (через запятую)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="налоги, бухгалтерия, УСН"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="published"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="published" className="font-normal">
                      Опубликовать сразу
                    </Label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1">
                      <Save className="mr-2 h-4 w-4" />
                      {isEditing ? "Сохранить" : "Создать"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false);
                        resetForm();
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Отмена
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {posts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    Статей пока нет. Создайте первую статью!
                  </p>
                </CardContent>
              </Card>
            ) : (
              posts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-24 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold truncate">{post.title}</h3>
                              {post.published ? (
                                <Badge variant="default" className="text-xs">
                                  Опубликовано
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="text-xs">
                                  Черновик
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              <span>{getCategoryName(post.category)}</span>
                              <span>•</span>
                              <span>{new Date(post.createdAt).toLocaleDateString("ru-RU")}</span>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/blog/${post.slug}`} target="_blank">
                                  <Eye className="mr-2 h-4 w-4" />
                                  Просмотр
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(post)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Редактировать
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleTogglePublish(post)}>
                                {post.published ? (
                                  <>
                                    <EyeOff className="mr-2 h-4 w-4" />
                                    Снять с публикации
                                  </>
                                ) : (
                                  <>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Опубликовать
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(post.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Удалить
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
