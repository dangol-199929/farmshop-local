import React from "react";
import BlogDetailImage from "./BlogDetailImage";
import BlogDetailTags from "./BlogDetailTags";
import BlogDetailHeader from "./BlogDetailHeader";
import BlogDetailAuthor from "./BlogDetailAuthor";
import BlogDetailContent from "./BlogDetailContent";

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
  return (
    <article className="max-w-4xl mx-auto p-4 md:p-6">
      <BlogDetailImage image={image} title={title} />
      <BlogDetailTags tags={tags} />
      <BlogDetailHeader title={title} />
      <BlogDetailAuthor createdBy={createdBy} createdAt={createdAt} />
      <BlogDetailContent content={content} />
    </article>
  );
};

export default BlogDetail;
