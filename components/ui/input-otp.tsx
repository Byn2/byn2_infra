"use client"

import * as React from "react"
import { OTPInput, type SlotProps } from "input-otp"
import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"

const inputOTPVariants = cva(
  "flex h-10 w-10 items-center justify-center border-y border-r border-input bg-background text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md focus-within:z-10 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-background",
  {
    variants: {
      variant: {
        default: "",
        outline: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

const InputOTP = React.forwardRef<React.ElementRef<typeof OTPInput>, React.ComponentPropsWithoutRef<typeof OTPInput>>(
  ({ className, ...props }, ref) => (
    <OTPInput ref={ref} containerClassName={cn("flex items-center gap-2", className)} {...props} />
  ),
)
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex items-center", className)} {...props} />,
)
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  SlotProps & { index: number } & React.ComponentPropsWithoutRef<"div">
>(({ char, hasFakeCaret, isActive, index, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(inputOTPVariants(), isActive && "z-10 ring-2 ring-ring ring-offset-background", className)}
    {...props}
  >
    {char}
    {hasFakeCaret && (
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="animate-caret-blink h-4 w-px bg-foreground duration-1000" />
      </div>
    )}
  </div>
))
InputOTPSlot.displayName = "InputOTPSlot"

export { InputOTP, InputOTPGroup, InputOTPSlot }
