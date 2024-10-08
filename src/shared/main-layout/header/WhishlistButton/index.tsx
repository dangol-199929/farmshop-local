import { useHeaderFunctions } from "@/hooks/header.hook";
import { useWishlists } from "@/hooks/wishlist.hooks";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Heart } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
const WishlistButton = () => {
  const { token, profile } = useHeaderFunctions();
  const { favList } = useWishlists();
  const router = useRouter();
  return (
    <>
      {token && profile && (
        <Button
          variant="ghost"
          className="hidden md:inline-flex relative rounded-2xl group"
          size="lg"
          onClick={() => {
            router.push("/wishlist");
          }}
        >
          <Heart
            className={`w-5 h-5 shrink-0 group-hover:text-secondary group-hover:fill-secondary ease-out  transition-all duration-300`}
          />
          <Badge
            variant={"secondary"}
            className="absolute -top-1 -right-1 px-1"
          >
            {favList ? favList.data?.length : 0}
          </Badge>
        </Button>
      )}
    </>
  );
};

export default WishlistButton;
