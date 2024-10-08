import React from "react";

interface BlogDetailContentProps {
  content: string;
}

const BlogDetailContent: React.FC<BlogDetailContentProps> = ({ content }) => {
  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default BlogDetailContent;
