import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "shimmer group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.97] hover:-translate-y-0.5",
  {
    variants: {
      variant: {
        // near-white primary — Linear/Vercel style
        default:
          "bg-[#fafafa] text-[#0a0a0b] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_10px_30px_-12px_rgba(0,0,0,0.9)] hover:bg-white",
        // restrained signal-blue accent on graphite
        accent:
          "border border-[#7dd3fc]/30 bg-[#7dd3fc]/[0.08] text-[#7dd3fc] shadow-[0_0_24px_-10px_rgba(125,211,252,0.6)] hover:bg-[#7dd3fc]/[0.14] hover:border-[#7dd3fc]/50",
        outline:
          "border border-white/12 bg-white/[0.04] text-foreground hover:bg-white/[0.08] hover:border-white/20 backdrop-blur",
        ghost: "text-foreground/75 hover:bg-white/[0.06] hover:text-foreground",
        destructive: "border border-[#fb7185]/30 bg-[#fb7185]/10 text-[#fb7185] hover:bg-[#fb7185]/16",
        link: "text-[#7dd3fc] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 px-3.5 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  ),
);
Button.displayName = "Button";

export { Button, buttonVariants };
