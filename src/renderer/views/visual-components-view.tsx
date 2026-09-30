import { cn } from "cn"
import { PlusIcon, SettingsIcon } from "lucide-react"
import { useState, type ReactNode } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/renderer/components/ui/alert"
import { Badge } from "@/renderer/components/ui/badge"
import { Button } from "@/renderer/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/renderer/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/renderer/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/renderer/components/ui/dropdown-menu"
import { Input } from "@/renderer/components/ui/input"
import { Label } from "@/renderer/components/ui/label"
import { ScrollArea } from "@/renderer/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/renderer/components/ui/select"
import { Separator } from "@/renderer/components/ui/separator"
import { Skeleton } from "@/renderer/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/renderer/components/ui/tabs"
import { Textarea } from "@/renderer/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/renderer/components/ui/tooltip"

const providers = [
  { label: "Anthropic", value: "anthropic" },
  { label: "OpenAI", value: "openai" },
  { label: "Gemini", value: "gemini" },
  { label: "Ollama", value: "ollama" },
]

const colors = [
  { name: "background", className: "bg-background" },
  { name: "surface", className: "bg-surface" },
  { name: "muted", className: "bg-muted" },
  { name: "foreground", className: "bg-foreground" },
  { name: "muted-foreground", className: "bg-muted-foreground" },
  { name: "border", className: "bg-border" },
  { name: "edge", className: "bg-edge" },
  { name: "ring", className: "bg-ring" },
  { name: "destructive", className: "bg-destructive" },
]

const topics = [
  "HTTP",
  "C#",
  "Linear algebra",
  "HVAC electrical fundamentals",
  "SQL Server",
  "Computer networking",
  "CORS",
  "TCP handshakes",
  "Garbage collection",
  "Eigenvectors",
  "Ohm's law",
  "Query plans",
]

export function VisualComponentsView() {
  return (
    <>
      <div className="titlebar sticky top-0 z-10 bg-background" />
      <main className="mx-auto flex max-w-5xl flex-col gap-12 px-8 pb-12">
        <header className="flex flex-col gap-2">
          <h1 className="font-heading text-2xl font-semibold">Visual Components</h1>
          <p className="text-sm text-muted-foreground">
            The canonical components of Evolution Engine. Run{" "}
            <code className="font-mono text-foreground">ShowDefaultView()</code> in the console to
            return to the app.
          </p>
        </header>

        <Showcase title="Color scheme">
          {colors.map((color) => (
            <ColorSwatch key={color.name} name={color.name} className={color.className} />
          ))}
        </Showcase>

        <Showcase title="Elevation">
          <Swatch name="sunken" className="bg-surface shadow-sunken" />
          <Swatch name="background" className="bg-background ring-1 ring-border" />
          <Swatch name="raised" className="bg-surface shadow-raised" />
          <Swatch name="overlay" className="bg-surface shadow-overlay" />
          <Swatch name="control" className="border border-edge bg-surface" />
        </Showcase>

        <Showcase title="Text">
          <div className="flex flex-col gap-1 text-sm">
            <p className="text-foreground">Foreground: primary text</p>
            <p className="text-muted-foreground">Muted foreground: secondary text and labels</p>
            <p className="font-medium text-destructive">Destructive: errors and destructive actions</p>
          </div>
        </Showcase>

        <Showcase title="Button">
          <Button>Continue</Button>
          <Button size="icon" aria-label="New topic">
            <PlusIcon />
          </Button>
          <Button size="icon" aria-label="Settings">
            <SettingsIcon />
          </Button>
          <Button disabled>Disabled</Button>
        </Showcase>

        <Showcase title="Badge">
          <Badge>Teach mode</Badge>
          <Badge variant="destructive">Overdue</Badge>
        </Showcase>

        <Showcase title="Input and label">
          <Field className="w-64" id="gallery-input" label="Topic">
            <Input id="gallery-input" placeholder="HTTP" />
          </Field>
          <Field className="w-64" id="gallery-input-invalid" label="Invalid">
            <Input id="gallery-input-invalid" defaultValue="Not a topic" aria-invalid />
          </Field>
          <Field className="w-64" id="gallery-input-disabled" label="Disabled">
            <Input id="gallery-input-disabled" placeholder="Unavailable" disabled />
          </Field>
        </Showcase>

        <Showcase title="Textarea">
          <Field className="w-64" id="gallery-textarea" label="Explanation">
            <Textarea id="gallery-textarea" placeholder="Explain why the browser enforces CORS" />
          </Field>
          <Field className="w-64" id="gallery-textarea-invalid" label="Invalid">
            <Textarea id="gallery-textarea-invalid" defaultValue="The server blocks the response." aria-invalid />
          </Field>
          <Field className="w-64" id="gallery-textarea-disabled" label="Disabled">
            <Textarea id="gallery-textarea-disabled" placeholder="Unavailable" disabled />
          </Field>
        </Showcase>

        <Showcase title="Select">
          <ProviderSelect />
          <ProviderSelect disabled />
        </Showcase>

        <Showcase title="Card">
          <div className="w-80">
            <Card>
              <CardHeader>
                <CardTitle>HTTP</CardTitle>
                <CardDescription>Last studied two days ago</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Status codes, caching headers, and why the browser enforces CORS.
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="w-64">
            <Card size="sm">
              <CardHeader>
                <CardTitle>Small card</CardTitle>
                <CardDescription>Compact spacing</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">For dense lists.</p>
              </CardContent>
            </Card>
          </div>
        </Showcase>

        <Showcase title="Separator">
          <div className="flex w-80 flex-col gap-3 text-sm">
            <p>Explore</p>
            <Separator />
            <div className="flex h-5 items-center gap-3">
              <span>Teach</span>
              <Separator orientation="vertical" />
              <span>Practice</span>
              <Separator orientation="vertical" />
              <span>Assess</span>
            </div>
          </div>
        </Showcase>

        <Showcase title="Scroll area">
          <div className="h-48 w-64 border border-border bg-surface">
            <ScrollArea className="h-full">
              <ul className="flex flex-col pr-4.5 pl-2 text-sm">
                {topics.map((topic) => (
                  <li key={topic} className="border-b border-border py-2 last:border-b-0">
                    {topic}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        </Showcase>

        <Showcase title="Tabs">
          <ModeTabs />
        </Showcase>

        <Showcase title="Dialog">
          <Dialog>
            <DialogTrigger render={<Button />}>Create topic</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create topic</DialogTitle>
                <DialogDescription>Each topic becomes a persistent learning thread.</DialogDescription>
              </DialogHeader>
              <Field id="gallery-dialog-topic" label="Name">
                <Input id="gallery-dialog-topic" placeholder="Computer networking" />
              </Field>
              <DialogFooter showCloseButton>
                <Button>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Showcase>

        <Showcase title="Dropdown menu">
          <TopicMenu />
        </Showcase>

        <Showcase title="Tooltip">
          <Tooltip>
            <TooltipTrigger render={<Button />}>Top</TooltipTrigger>
            <TooltipContent>Hints get progressively stronger</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger render={<Button />}>Bottom</TooltipTrigger>
            <TooltipContent side="bottom">Predict before you run it</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger render={<Button size="icon" aria-label="Settings" />}>
              <SettingsIcon />
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </Showcase>

        <Showcase title="Skeleton">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        </Showcase>

        <Showcase title="Alert">
          <div className="flex w-full max-w-xl flex-col gap-3">
            <Alert>
              <AlertTitle>Review scheduled</AlertTitle>
              <AlertDescription>CORS comes back tomorrow without hints.</AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertTitle>Provider unreachable</AlertTitle>
              <AlertDescription>Check the endpoint and try again.</AlertDescription>
            </Alert>
          </div>
        </Showcase>
      </main>
    </>
  )
}

function Showcase({ title, children }: { readonly title: string; readonly children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xs font-medium tracking-widest text-muted-foreground uppercase">{title}</h2>
      <div className="flex flex-wrap items-start gap-4">{children}</div>
    </section>
  )
}

function Swatch({ name, className }: { readonly name: string; readonly className: string }) {
  return (
    <div className={cn("flex h-24 w-40 items-end p-3 font-mono text-xs text-muted-foreground", className)}>
      {name}
    </div>
  )
}

function ColorSwatch({ name, className }: { readonly name: string; readonly className: string }) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(`--${name}`)

  return (
    <div className="flex w-36 flex-col gap-2">
      <div className={cn("h-14 border border-border", className)} />
      <div className="flex flex-col gap-0.5 font-mono text-xs">
        <span className="text-foreground">{name}</span>
        <span className="text-muted-foreground">{value}</span>
      </div>
    </div>
  )
}

function Field({
  className,
  id,
  label,
  children,
}: {
  readonly className?: string
  readonly id: string
  readonly label: string
  readonly children: ReactNode
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  )
}

function ProviderSelect({ disabled }: { readonly disabled?: boolean }) {
  return (
    <Select items={providers} defaultValue="anthropic" disabled={disabled}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Providers</SelectLabel>
          {providers.map((provider) => (
            <SelectItem key={provider.value} value={provider.value}>
              {provider.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

function ModeTabs() {
  return (
    <div className="w-96">
      <Tabs defaultValue="teach">
        <TabsList>
          <TabsTrigger value="explore">Explore</TabsTrigger>
          <TabsTrigger value="teach">Teach</TabsTrigger>
          <TabsTrigger value="practice">Practice</TabsTrigger>
          <TabsTrigger value="assess">Assess</TabsTrigger>
        </TabsList>
        <TabsContent value="explore">
          <p className="text-sm text-muted-foreground">Investigate freely.</p>
        </TabsContent>
        <TabsContent value="teach">
          <p className="text-sm text-muted-foreground">Build understanding with plenty of help.</p>
        </TabsContent>
        <TabsContent value="practice">
          <p className="text-sm text-muted-foreground">Less help, more retrieval.</p>
        </TabsContent>
        <TabsContent value="assess">
          <p className="text-sm text-muted-foreground">No assistance.</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TopicMenu() {
  const [showArchived, setShowArchived] = useState(false)
  const [sort, setSort] = useState("recent")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button />}>Topic actions</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>HTTP</DropdownMenuLabel>
          <DropdownMenuItem>
            Duplicate
            <DropdownMenuShortcut>Ctrl+D</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Move to</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Networking</DropdownMenuItem>
              <DropdownMenuItem>Web</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>View</DropdownMenuLabel>
          <DropdownMenuCheckboxItem checked={showArchived} onCheckedChange={setShowArchived}>
            Show archived
          </DropdownMenuCheckboxItem>
          <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
            <DropdownMenuRadioItem value="recent">Most recent</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="alphabetical">Alphabetical</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Close thread</DropdownMenuItem>
        <DropdownMenuItem variant="destructive">
          Delete topic
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
