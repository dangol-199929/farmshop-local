import React from "react";
import Link from "next/link";
import { ArrowRightIcon, ArrowUpRight } from "lucide-react";

import CustomImage from "@/features/custom-image";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/shared/components/ui/card";
import { FallBackImg } from "@/shared/lib/image-config";

function BlogCard({
  title,
  excerpt,
  slug,
  authorName,
  publishedDate,
  featuredImage,
  size,
}: {
  title: string;
  excerpt: string;
  slug: string;
  authorName: string;
  publishedDate: string;
  featuredImage: string | null;
  size: "sm" | "md" | "lg";
}) {
  return (
    <Card
      className={`overflow-hidden ${
        size === "sm" ? "border-0 shadow-none" : ""
      }`}
    >
      <CustomImage
        src={featuredImage}
        alt={title}
        className={`w-full h-48 object-cover border ${
          size === "sm" ? "rounded-2xl" : ""
        }`}
        height={100}
        width={100}
        fallback={FallBackImg}
      />
      <CardHeader className={`${size === "sm" ? "px-0 py-4" : ""}`}>
        <Link href={`/page/blog/${slug}`}>
          <h2
            className={`text-2xl font-bold ${
              size === "sm" ? "line-clamp-1" : "line-clamp-2"
            } hover:text-primary transition-all duration-200
          ${size === "sm" ? "text-base" : ""}`}
          >
            {title}
          </h2>
        </Link>
      </CardHeader>
      <CardContent className={`${size === "sm" ? "pb-4 pt-0 px-0" : ""}`}>
        {/* <div className="flex items-center text-sm text-gray-500 mb-2">
          <User2 size={16} className="mr-1" />
          <span>{authorName || "Admin"}</span>
          <span className="mx-2">|</span>
          <CalendarDays size={16} className="mr-1" />
          <span>{publishedDate}</span>
        </div> */}
        <div className={`line-clamp-2  h-12`}>
          <p
            className={`${
              size === "sm" ? "text-base" : ""
            } font-light text-gray-500`}
            dangerouslySetInnerHTML={{ __html: excerpt }}
          />
        </div>
      </CardContent>
      <CardFooter className={`${size === "sm" ? "px-0" : ""}`}>
        <Button>
          <Link href={`/page/blog/${slug}`}>
            <span className="flex items-center">
              Read More <ArrowRightIcon className="ml-2 w-4 h-4" />
            </span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default BlogCard;
