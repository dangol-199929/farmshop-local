import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import BlogDetail from "@/features/blog/blog-detail/BlogDetail";
import { IBlogItem } from "@/interface/blog.interface";
import { getBlogDetailsFromSlug, getBlogs } from "@/services/blog.service";
import MainLayout from "@/shared/main-layout";
import { useQuery } from "@tanstack/react-query";

import { config } from "../../../../../config";
import { NextPageWithLayout } from "../../../../pages/_app";
import { Skeleton } from "@/shared/components/ui/skeleton";

const BlogPost: NextPageWithLayout = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState<any>();
  const {
    data: blogsdata,
    isLoading,
    error,
  } = useQuery(["getBlogs"], getBlogs);

  useEffect(() => {
    const post = blogsdata?.data?.find((blog: IBlogItem) => blog.slug === slug);
    setPost(post);
  }, [slug, blogsdata]);
  return (
    <>
      <Head>
        <title>{post?.title}</title>
      </Head>
      <div className="container mt-6">
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
    </>
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
