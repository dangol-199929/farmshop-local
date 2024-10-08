import CustomImage from "@/features/custom-image";
import { Button } from "@/shared/components/ui/button";
import { UpArrow } from "@/shared/lib/image-config";

import { useState, useEffect } from "react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Button
      title="scroll to top"
      type="button"
      className={`${
        isVisible ? "opacity-100" : "opacity-0"
      } fixed bottom-6 right-[100px] z-[100] md:right-[95px] rounded-full p-4 py-6 !aspect-square border border-white/20`}
      onClick={scrollToTop}
    >
      <CustomImage
        src={UpArrow}
        height={100}
        width={100}
        alt="scroll"
        style={{ width: "auto", height: "auto" }}
        className="min-w-[15px] max-w-[15px] md:max-w-full"
      />
    </Button>
  );
};

export default ScrollToTopButton;
