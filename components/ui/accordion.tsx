import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { cn } from "@/lib/utils"
import { MinusIcon, PlusIcon } from "lucide-react"

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn(className)}
      {...props}
    />
  )
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b last:border-b-0", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group focus-visible:ring-ring/50 flex flex-1 items-center justify-between gap-4 rounded-md py-6 text-left text-sm font-medium text-foreground transition-colors outline-none focus-visible:ring-[3px] aria-disabled:pointer-events-none aria-disabled:opacity-50 data-panel-open:text-indigo",
          className
        )}
        {...props}
      >
        {children}
        {/* The original's disclosure: a grey plus that turns into an indigo minus when open. */}
        <PlusIcon aria-hidden strokeWidth={1.25} className="pointer-events-none size-6 shrink-0 text-[#9ca3af] group-hover:text-[#6b7280] group-aria-expanded:hidden" />
        <MinusIcon aria-hidden strokeWidth={1.25} className="pointer-events-none hidden size-6 shrink-0 text-indigo group-aria-expanded:block" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="overflow-hidden text-sm data-open:animate-accordion-down data-closed:animate-accordion-up"
      {...props}
    >
      <div
        className={cn(
          "h-(--accordion-panel-height) pt-0 pb-6 data-ending-style:h-0 data-starting-style:h-0",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
