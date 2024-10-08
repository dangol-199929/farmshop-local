import CustomImage from "@/features/custom-image";
import { UpArrow } from "@/shared/lib/image-config";
import Image from "next/image";
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
    <button
      title="scroll to top"
      type="button"
      className={`${
        isVisible ? "opacity-100" : "opacity-0"
      } fixed bottom-6 right-[100px] z-[100] md:right-[95px] bg-primary text-white rounded-full p-2  md:p-5 transition-opacity duration-300 hover:bg-orange-100`}
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
    </button>
  );
};

export default ScrollToTopButton;
