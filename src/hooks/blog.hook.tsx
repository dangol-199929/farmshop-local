import { getBlogs } from "@/services/blog.service";
import { useQuery } from "@tanstack/react-query";

export const useBlogs = () => {
  interface Blog {
    data: BlogPost[];
  }
  interface BlogPost {
    author_name: string;
    content: string;
    featured_image: string | null;
    id: number;
    published_date: string;
    slug: string;
    status: string;
    tags: string | null;
    title: string;
    createdBy: string;
    createdAt: string;
    image: string;
  }
  const {
    data: blogsdata,
    isLoading,
    error,
  } = useQuery<Blog>(["getBlogs"], getBlogs);

  return {
    blogsdata,
    isLoading,
    error,
  };
};
