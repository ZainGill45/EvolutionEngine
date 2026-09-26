import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border border-edge bg-surface text-sm font-medium whitespace-nowrap text-foreground cursor-pointer outline-none select-none hover:border-ring active:border-ring active:bg-background focus-visible:border-ring aria-expanded:border-ring disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      size: {
        default:
          "h-8 px-3",
        icon: "size-8",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

function Button({
  className,
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ size, className }))}
      {...props}
    />
  )
}

export { Button }
