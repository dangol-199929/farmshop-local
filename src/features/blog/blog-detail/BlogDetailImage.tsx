import React from "react";
import CustomImage from "@/features/custom-image";
import { FallBackImg } from "@/shared/lib/image-config";

interface BlogDetailImageProps {
  image: string | null;
  title: string;
}

const BlogDetailImage: React.FC<BlogDetailImageProps> = ({ image, title }) => {
  return (
    <CustomImage
      src={image ? image : FallBackImg}
      alt={title}
      className="w-full h-[200px] md:h-[400px] object-cover rounded-lg mb-6"
      width={100}
      height={100}
      fallback={FallBackImg}
    />
  );
};

export default BlogDetailImage;
