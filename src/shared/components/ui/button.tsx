import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/utils/utils";
import { Loader2 } from "lucide-react";
// import ReactLoading from "react-loading"; // Import a loading spinner component

const buttonVariants = cva(
  "inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-secondary",
        primary: "bg-[#FA9B1B] text-white hover:bg-[#FA9B1B]/80",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-red-400",
        outline:
          "border border-primary bg-background text-primary hover:bg-primary hover:text-white hover:border-primary",
        outlineSecondary:
          "border border-secondary bg-background text-secondary hover:text-white hover:border-secondary",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-gray-200 hover:text-secondary border border-secondary hover:border-secondary",
        ghost:
          "bg-[#F9F9FA] hover:bg-gray-100 transition-all duration-300 text-[#414042] hover:text-primary border border-[#EDEDED] hover:border-primary",
        cart: "bg-[#00A187]/10  text-primary hover:bg-[#00A187]/50 !rounded-lg",
        list: "hover:bg-gray-100 transition-all duration-300 text-[#414042] hover:text-primary !border-b-[4px] rounded-t-0 !border-b-primary !rounded-b-none !rounded-t-lg",
        icon: "bg-transparent hover:text-primary text-[#414042]",
        link: "text-primary underline-offset-4 hover:underline ",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-sm",
        lg: "h-[48px] rounded-md py-4 px-4 text-lg",
        icon: "h-10 w-10",
      },
      rounded: {
        default: "rounded-lg",
        none: "!rounded-0",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "!rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean; // Add loading prop
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
        {loading && (
          <Loader2
            size={16}
            strokeWidth={3}
            className="text-primary animate-spin ms-1"
          />
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
