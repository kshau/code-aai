import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
      difficulty: {
        none:
          "",
        easy:
          "bg-difficulty-easy hover:bg-difficulty-easy/80", 
        medium:
          "bg-difficulty-medium hover:bg-difficulty-medium/80", 
        hard:
          "bg-difficulty-hard hover:bg-difficulty-hard/80", 
      }
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, difficulty, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, difficulty }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
