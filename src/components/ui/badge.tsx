import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-ghost-violet/20 text-ghost-violet",
        cyan: "border-transparent bg-ghost-cyan/15 text-ghost-cyan",
        emerald: "border-transparent bg-ghost-emerald/15 text-ghost-emerald",
        amber: "border-transparent bg-ghost-amber/15 text-ghost-amber",
        rose: "border-transparent bg-ghost-rose/15 text-ghost-rose",
        outline: "border-white/15 text-foreground/80",
        muted: "border-transparent bg-white/5 text-muted-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
