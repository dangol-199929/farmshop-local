import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

interface Category {
  title: string;
  image: string;
  totalProducts: number;
  shopLink: string;
}
const pastelColors = [
  "#FEEFEA",
  "#FFF3FF",
  "#F2FCE4",
  "#FEEFEA",
  "#ECFFEC",
  "#FFFCEB",
];
export default function CategoryCard({
  title,
  image,
  totalProducts,
  shopLink,
}: Category) {
  const backgroundColor = useMemo(() => {
    const index =
      title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      pastelColors.length;
    return pastelColors[index];
  }, [title]);

  return (
    <Link
      href={shopLink}
      className="block hover:scale-105 transition-all duration-300"
    >
      <div className="rounded-2xl p-4 text-center" style={{ backgroundColor }}>
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 font-light">
          {totalProducts} Products
        </p>
        <div className="relative w-full aspect-square mt-4">
          <Image
            src={image}
            alt={title}
            layout="fill"
            objectFit="contain"
            className="rounded-lg"
          />
        </div>
      </div>
    </Link>
  );
}
