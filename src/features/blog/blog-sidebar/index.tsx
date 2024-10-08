import React, { useState } from "react";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent } from "@/shared/components/ui/card";
import CustomImage from "@/features/custom-image";
import { FallBackImg } from "@/shared/lib/image-config";

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
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Test blog",
    author_name: "Admin -test",
    content: "<p>this is the test blog</p>",
    featured_image: null,
    published_date: "1 week ago",
    slug: "test-blog",
    status: "Published",
    tags: null,
  },
  {
    id: 2,
    title: "Save your plant",
    author_name: "Plant Expert",
    content: "<p>Tips for saving your dying plants</p>",
    featured_image: null,
    published_date: "1 week ago",
    slug: "save-your-plant",
    status: "Published",
    tags: null,
  },
  {
    id: 3,
    title: "10 Benefits of",
    author_name: "Health Guru",
    content: "<p>Discover the amazing benefits of...</p>",
    featured_image: "/placeholder.svg?height=40&width=40",
    published_date: "1 week ago",
    slug: "10-benefits-of",
    status: "Published",
    tags: null,
  },
  {
    id: 4,
    title: "7 Best organic",
    author_name: "Organic Enthusiast",
    content: "<p>The top organic products you should try</p>",
    featured_image: null,
    published_date: "1 week ago",
    slug: "7-best-organic",
    status: "Published",
    tags: null,
  },
];

function BlogSidebar() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPosts = blogPosts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <Input
          type="text"
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-6 border-gray-300"
        />
        <h2 className="text-xl font-bold mb-4">Recent Posts</h2>
        <ul className="space-y-4">
          {filteredPosts.map((post, index) => (
            <li
              key={post.id}
              className={`flex items-center space-x-4  border-gray-200 pb-4 
                ${
                  index < filteredPosts.length - 1
                    ? "border-b border-gray-200"
                    : ""
                }`}
            >
              <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                <CustomImage
                  src={post?.featured_image || FallBackImg}
                  alt="zxc"
                  className="w-full h-full object-cover"
                  height={100}
                  width={100}
                  fallback={FallBackImg}
                />
              </div>
              <div>
                <h3 className="font-semibold">{post.title}</h3>
                <p className="text-sm text-gray-500">{post.published_date}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default BlogSidebar;
