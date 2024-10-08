import React from "react";
import { Badge } from "@/shared/components/ui/badge";

interface BlogDetailTagsProps {
  tags: string | null;
}

const BlogDetailTags: React.FC<BlogDetailTagsProps> = ({ tags }) => {
  const tagList = tags ? tags.split(",") : [];

  return (
    <div className="mb-2">
      {tagList.map((tag, index) => (
        <Badge key={index} variant="secondary" className="mr-2 mb-2">
          {tag}
        </Badge>
      ))}
    </div>
  );
};

export default BlogDetailTags;
