import React from "react";

interface BlogDetailHeaderProps {
  title: string;
}

const BlogDetailHeader: React.FC<BlogDetailHeaderProps> = ({ title }) => {
  return <h1 className="text-2xl md:text-3xl font-bold mb-4">{title}</h1>;
};

export default BlogDetailHeader;
