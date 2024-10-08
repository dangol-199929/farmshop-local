import CustomImage from "@/features/custom-image";
import { IBlogContent } from "@/interface/blog.interface";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface IProps {
  blog: IBlogContent;
}

const LatestBlogCard = ({ blog }: IProps) => {
  return (
    <div className="latest-blog-card">
      <figure>
        <CustomImage
          src={blog?.thumbnail}
          width={600}
          height={600}
          quality={100}
          className="h-[250px] object-cover"
          alt={`blog-${blog?.imageAltText}`}
        />
      </figure>
      <div className="latest-blog-card__desc">
        <div
          className="w-full tooltip tooltip-bottom  mb-3.5"
          data-tip={blog?.title}
        >
          <Link
            href={`/blogs/${blog?.slug}`}
            className="block text-start transition-all hover:text-primary leading-[1.3] text-slate-850 capitalize font-bold truncate text-normal"
          >
            {blog?.title}
          </Link>
        </div>
        <div
          className="latest-blog-card__desc--description"
          dangerouslySetInnerHTML={{ __html: blog?.content }}
        ></div>
      </div>
      <Link
        href={`/blogs/${blog?.slug}`}
        className="bg-primary flex justify-center w-fit text-sm items-center gap-2 mr-auto text-base-100 font-bold py-[10px] px-[22px] uppercase rounded-full hover:bg-slate-850 "
      >
        Read More
      </Link>
    </div>
  );
};

export default LatestBlogCard;
