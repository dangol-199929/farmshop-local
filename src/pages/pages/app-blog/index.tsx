import axios from "axios";
import Head from "next/head";
import React from "react";

import BlogCard from "@/features/blog/blog-card";
import BlogSidebar from "@/features/blog/blog-sidebar";
import { IBlogItem } from "@/interface/blog.interface";
import { getBlogs } from "@/services/blog.service";
import MainLayout from "@/shared/main-layout";
import { useQuery } from "@tanstack/react-query";

import { config } from "../../../../config";
// import { NextPageWithLayout } from "../_app";

const BlogIndex = () => {
  const {
    data: blogsdata,
    isLoading,
    error,
  } = useQuery(["getBlogs"], getBlogs);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading blogs</div>;
  }

  return (
    <>
      <Head>
        <title>Blog</title>
      </Head>
      <div className="container my-[60px]">
        <div className="grid grid-cols-12 md:gap-[30px]">
          <div className="order-last col-span-12 md:order-first md:col-span-3 right-sidebar">
            <BlogSidebar />
          </div>
          <div className="col-span-12 md:col-span-9">
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
              {blogsdata?.data?.map((post: IBlogItem) => (
                <div key={post.id.toString()}>
                  <BlogCard
                    title={post.title}
                    excerpt={post.content}
                    slug={post.slug}
                    authorName={post.createdBy}
                    publishedDate={post.createdAt}
                    featuredImage={post.image}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogIndex;

BlogIndex.getLayout = (page: any) => {
  // const configData = page?.props;
  return <div>{page}</div>;
};

export async function getServerSideProps() {
  const baseUrl = config?.gateway?.apiURL;
  const endPoint1 = config?.gateway?.apiEndPoint1;
  const apiUrl = `${baseUrl}/${endPoint1}/configs`;
  const response: any = await axios.get(apiUrl, {
    headers: {
      Accept: "application/json",
      "Api-Key": config.gateway.apiKey,
    },
  });

  return {
    props: response?.data,
  };
}
