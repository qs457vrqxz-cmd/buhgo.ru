"use client";

import { useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Paperclip,
  X,
  FileText,
  Image as ImageIcon,
  File,
  Download,
} from "lucide-react";
import type { MessageAttachment } from "@/lib/messages";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "text/plain",
  "application/zip",
  "application/x-rar-compressed",
];

const getFileIcon = (type: string) => {
  if (type.startsWith("image/")) return ImageIcon;
  if (type.includes("pdf") || type.includes("word") || type.includes("document")) return FileText;
  return File;
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// Convert File to MessageAttachment with base64
export const fileToAttachment = async (file: File): Promise<MessageAttachment> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve({
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        url: reader.result as string,
        type: file.type,
        size: file.size,
      });
    };
    reader.onerror = (error) => reject(error);
  });
};

interface ChatFileUploadProps {
  attachments: MessageAttachment[];
  setAttachments: (attachments: MessageAttachment[]) => void;
  disabled?: boolean;
  maxFiles?: number;
}

export function ChatFileUpload({
  attachments,
  setAttachments,
  disabled = false,
  maxFiles = 5,
}: ChatFileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `Файл "${file.name}" слишком большой (макс. 10 МБ)`;
    }
    if (!ALLOWED_TYPES.includes(file.type) && !file.type.startsWith("image/")) {
      return `Тип файла "${file.name}" не поддерживается`;
    }
    return null;
  };

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const errors: string[] = [];
    const newAttachments: MessageAttachment[] = [];

    for (const file of fileArray) {
      if (attachments.length + newAttachments.length >= maxFiles) {
        errors.push(`Максимум ${maxFiles} файлов`);
        break;
      }

      const error = validateFile(file);
      if (error) {
        errors.push(error);
        continue;
      }

      try {
        const attachment = await fileToAttachment(file);
        newAttachments.push(attachment);
      } catch {
        errors.push(`Ошибка загрузки файла "${file.name}"`);
      }
    }

    if (errors.length > 0) {
      alert(errors.join("\n"));
    }

    if (newAttachments.length > 0) {
      setAttachments([...attachments, ...newAttachments]);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [attachments, setAttachments, maxFiles]);

  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter((a) => a.id !== id));
  };

  return (
    <div className="flex flex-col gap-2">
      {/* File previews */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((attachment) => {
            const Icon = getFileIcon(attachment.type);
            const isImage = attachment.type.startsWith("image/");

            return (
              <div
                key={attachment.id}
                className="relative group"
              >
                {isImage ? (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border">
                    <img
                      src={attachment.url}
                      alt={attachment.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeAttachment(attachment.id)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 bg-muted rounded-lg px-2 py-1.5 text-xs max-w-[140px]">
                    <Icon className="h-4 w-4 text-primary shrink-0" />
                    <span className="truncate">{attachment.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(attachment.id)}
                      className="text-muted-foreground hover:text-destructive shrink-0"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Upload button */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ALLOWED_TYPES.join(",")}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || attachments.length >= maxFiles}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs text-muted-foreground"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || attachments.length >= maxFiles}
        >
          <Paperclip className="h-4 w-4 mr-1" />
          Прикрепить файл
          {attachments.length > 0 && (
            <Badge variant="secondary" className="ml-1 h-4 text-[10px]">
              {attachments.length}/{maxFiles}
            </Badge>
          )}
        </Button>
      </div>
    </div>
  );
}

// Component to display attachments in messages
export function MessageAttachments({
  attachments,
  isOwn = false,
}: {
  attachments: MessageAttachment[];
  isOwn?: boolean;
}) {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="space-y-1.5">
      {attachments.map((attachment) => {
        const Icon = getFileIcon(attachment.type);
        const isImage = attachment.type.startsWith("image/");

        if (isImage) {
          return (
            <a
              key={attachment.id}
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <img
                src={attachment.url}
                alt={attachment.name}
                className="max-w-[180px] sm:max-w-[220px] max-h-[140px] rounded-lg object-cover border"
                loading="lazy"
              />
            </a>
          );
        }

        return (
          <a
            key={attachment.id}
            href={attachment.url}
            download={attachment.name}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
              isOwn
                ? "bg-white/20 hover:bg-white/30 text-white"
                : "bg-background border hover:bg-muted"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate flex-1 max-w-[120px]">{attachment.name}</span>
            {attachment.size && (
              <span className="opacity-70 shrink-0 text-[10px]">
                {formatFileSize(attachment.size)}
              </span>
            )}
            <Download className="h-3 w-3 shrink-0 opacity-70" />
          </a>
        );
      })}
    </div>
  );
}
