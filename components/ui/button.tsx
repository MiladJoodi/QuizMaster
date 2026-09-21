import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-bold uppercase tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 active:translate-x-[2px] active:translate-y-[2px] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-[3px] border-primary bg-primary text-primary-foreground shadow-[4px_4px_0_0_var(--acid)] hover:brightness-110 hover:shadow-[6px_6px_0_0_var(--acid)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-none",
        destructive:
          "border-[3px] border-destructive bg-destructive text-destructive-foreground shadow-[4px_4px_0_0_#7f1d1d] hover:brightness-110",
        outline:
          "border-[3px] border-foreground bg-transparent text-foreground shadow-[4px_4px_0_0_var(--primary)] hover:bg-primary hover:text-primary-foreground hover:border-primary",
        secondary:
          "border-[3px] border-acid bg-acid text-accent-foreground shadow-[4px_4px_0_0_var(--primary)] hover:brightness-110",
        ghost: "border-[3px] border-transparent hover:border-border hover:bg-inset",
        link: "text-primary underline-offset-4 hover:underline normal-case tracking-normal shadow-none",
        signal:
          "border-[3px] border-signal bg-signal text-signal-foreground shadow-[4px_4px_0_0_var(--primary)] hover:brightness-110",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-md px-3.5 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
