import React from "react";
import BlogSidebar from "../blog-sidebar";
import BlogCard from "../blog-card";
import { IBlogItem } from "@/interface/blog.interface";
import { useBlogs } from "@/hooks/blog.hook";

const BlogPage = () => {
  // const {
  //   data: blogsdata,
  //   isLoading,
  //   error,
  // } = useQuery(["getBlogs"], getBlogs);
  const { blogsdata, isLoading, error } = useBlogs();

  return (
    <div className="container my-[60px]">
      <div className="grid grid-cols-12 md:gap-[30px]">
        <div className="order-last col-span-12 md:order-first md:col-span-3 right-sidebar">
          <BlogSidebar />
        </div>
        <div className="col-span-12 md:col-span-9">
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
            {blogsdata?.data?.map((post: IBlogItem) => (
              <React.Fragment key={post.id}>
                <BlogCard
                  key={post.id.toString()}
                  title={post.title}
                  excerpt={post.content}
                  slug={post.slug}
                  authorName={post.createdBy}
                  publishedDate={post.createdAt}
                  featuredImage={post.image}
                />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
