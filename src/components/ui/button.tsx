import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "shimmer group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.97] hover:-translate-y-0.5",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-ghost-violet to-ghost-indigo text-white shadow-[0_8px_30px_-8px_rgba(139,92,246,0.6)] hover:shadow-[0_12px_40px_-8px_rgba(139,92,246,0.85)] hover:brightness-110",
        accent:
          "bg-gradient-to-r from-ghost-cyan to-ghost-emerald text-slate-950 shadow-[0_8px_30px_-8px_rgba(34,211,238,0.6)] hover:shadow-[0_12px_40px_-8px_rgba(34,211,238,0.85)] hover:brightness-110",
        outline:
          "border border-white/15 bg-white/5 text-foreground hover:bg-white/10 backdrop-blur",
        ghost: "text-foreground/80 hover:bg-white/10 hover:text-foreground",
        destructive: "bg-ghost-rose/90 text-white hover:bg-ghost-rose",
        link: "text-ghost-cyan underline-offset-4 hover:underline",
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
