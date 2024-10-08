import { CalendarDays } from "lucide-react";
import React from "react";

import CustomImage from "@/features/custom-image";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { FallBackImg } from "@/shared/lib/image-config";

interface BlogDetailProps {
  id: number;
  title: string;
  createdBy: string;
  content: string;
  image: string | null;
  createdAt: string;
  slug: string;
  status: string;
  tags: string | null;
}

const BlogDetail: React.FC<BlogDetailProps> = ({
  id,
  title,
  createdBy,
  content,
  image,
  createdAt,
  slug,
  status,
  tags,
}) => {
  const tagList = tags ? tags.split(",") : [];

  return (
    <article className="max-w-4xl mx-auto p-4 md:p-6">
      <CustomImage
        src={image ? image : FallBackImg}
        alt={title}
        className="w-full h-[200px] md:h-[400px] object-cover rounded-lg mb-6"
        width={100}
        height={100}
        fallback={FallBackImg}
      />
      <div className="mb-2">
        {tagList.map((tag, index) => (
          <Badge key={index} variant="secondary" className="mr-2 mb-2">
            {tag}
          </Badge>
        ))}
      </div>
      <h1 className="text-2xl md:text-3xl font-bold mb-4">{title}</h1>
      <div className="flex items-center space-x-4 mb-6">
        <Avatar>
          <AvatarImage
            src="/placeholder.svg?height=40&width=40"
            alt={createdBy}
          />
          <AvatarFallback>{FallBackImg}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{createdBy}</p>
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarDays className="w-4 h-4 mr-1" />
            {createdAt}
          </div>
        </div>
      </div>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
};

export default BlogDetail;
