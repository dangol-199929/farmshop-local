import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

interface SwiperNavigationProps {
  prevDisabled: boolean;
  nextDisabled: boolean;
  onPrevClick: () => void;
  onNextClick: () => void;
  className?: string;
}

export default function SwiperNavigation({
  prevDisabled,
  nextDisabled,
  onPrevClick,
  onNextClick,
  className = "",
}: SwiperNavigationProps) {
  return (
    <div className={`flex space-x-4 ${className}`}>
      <Button
        variant="outline"
        className="!rounded-full aspect-square p-0"
        title="Previous"
        disabled={prevDisabled}
        onClick={onPrevClick}
      >
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">Previous</span>
      </Button>
      <Button
        variant="outline"
        className="!rounded-full aspect-square p-0"
        title="Next"
        disabled={nextDisabled}
        onClick={onNextClick}
      >
        <ChevronRight className="h-6 w-6" />
        <span className="sr-only">Next</span>
      </Button>
    </div>
  );
}
