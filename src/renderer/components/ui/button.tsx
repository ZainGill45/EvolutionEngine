import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border text-sm font-medium whitespace-nowrap cursor-pointer outline-none select-none focus-visible:border-ring disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      size: {
        default:
          "h-8 px-3 border-edge bg-surface text-foreground hover:border-ring active:border-ring active:bg-background aria-expanded:border-ring",
        icon: "size-8 border-transparent text-muted-foreground hover:text-foreground active:text-foreground aria-expanded:text-foreground",
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
