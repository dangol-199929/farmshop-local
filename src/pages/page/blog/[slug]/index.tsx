import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import BlogDetail from "@/features/blog/blog-detail/BlogDetail";
import { IBlogItem } from "@/interface/blog.interface";
import { getBlogDetailsFromSlug, getBlogs } from "@/services/blog.service";
import MainLayout from "@/shared/main-layout";
import { useQuery } from "@tanstack/react-query";
import { NextPageWithLayout } from "@/pages/_app";
import { config } from "../../../../../config";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useBlogs } from "@/hooks/blog.hook";

const BlogPost: NextPageWithLayout = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState<any>();
  // const {
  //   data: blogsdata,
  //   isLoading,
  //   error,
  // } = useQuery(["getBlogs"], getBlogs);
  const { blogsdata, isLoading, error } = useBlogs();

  useEffect(() => {
    const post = blogsdata?.data?.find((blog: IBlogItem) => blog.slug === slug);
    setPost(post);
  }, [slug, blogsdata]);

  return (
    <div>
      <Head>
        <title>{post?.title}</title>
      </Head>
      <div className="container mt-6">
        {isLoading && (
          <div className="mx-[100px]">
            <Skeleton className="h-[400px] w-full" />
            <div className=" my-4">
              <div className="flex items-center space-x-4 mb-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
              <Skeleton className="h-[14px] w-full mb-2" />
              <Skeleton className="h-[14px] w-full mb-2" />
              <Skeleton className="h-[14px] w-full mb-2" />
              <Skeleton className="h-[14px] w-full mb-2" />
              <Skeleton className="h-[14px] w-full mb-2" />
              <Skeleton className="h-[14px] w-full mb-2" />
              <Skeleton className="h-[14px] w-full mb-2" />
              <Skeleton className="h-[14px] w-full mb-2" />
              <Skeleton className="h-[14px] w-full mb-2" />
              <Skeleton className="h-[14px] w-full mb-2" />
            </div>
          </div>
        )}
        {post && (
          <BlogDetail
            id={post.id}
            title={post.title}
            createdBy={post.author_name}
            content={post.content}
            image={post.image}
            createdAt={post.published_date}
            slug={post.slug}
            status={post.status}
            tags={post.tags}
          />
        )}
      </div>
    </div>
  );
};

export default BlogPost;

BlogPost.getLayout = (page) => {
  const configData = page?.props;
  return <MainLayout configData={configData}>{page}</MainLayout>;
};

export async function getServerSideProps(context: any) {
  const { slug } = context.params;
  const baseUrl = config?.gateway?.apiURL;
  const endPoint1 = config?.gateway?.apiEndPoint1;
  const apiUrl = `${baseUrl}/${endPoint1}/configs`;
  const response: any = await axios.get(apiUrl, {
    headers: {
      Accept: "application/json",
      "Api-Key": config.gateway.apiKey,
    },
  });

  const post = await getBlogDetailsFromSlug(slug);

  return {
    props: {
      ...response?.data,
      post,
    },
  };
}
