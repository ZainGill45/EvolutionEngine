import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/renderer/components/ui/card"
import { invoke } from "@/renderer/lib/ipc"
import type { SystemStatus } from "@/shared/ipc"

type StatusState =
  | { readonly kind: "loading" }
  | { readonly kind: "ready"; readonly status: SystemStatus }
  | { readonly kind: "failed"; readonly message: string }

export function App() {
  const [state, setState] = useState<StatusState>({ kind: "loading" })

  useEffect(() => {
    invoke("system:status").then(
      (status) => { setState({ kind: "ready", status }) },
      (error: unknown) => {
        setState({
          kind: "failed",
          message: error instanceof Error ? error.message : "Unexpected error",
        })
      },
    )
  }, [])

  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Evolution Engine</CardTitle>
          <CardDescription>Stack status</CardDescription>
        </CardHeader>
        <CardContent>
          <StatusDetails state={state} />
        </CardContent>
      </Card>
    </main>
  )
}

function StatusDetails({ state }: { readonly state: StatusState }) {
  switch (state.kind) {
    case "loading":
      return <p className="text-sm text-muted-foreground">Connecting to the main process…</p>
    case "failed":
      return <p className="text-sm text-destructive">{state.message}</p>
    case "ready": {
      const rows = [
        ["App", state.status.appVersion],
        ["Electron", state.status.electronVersion],
        ["SQLite", state.status.sqliteVersion],
        ["Data", state.status.dataDirectory],
      ] as const
      return (
        <dl className="grid gap-3 text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-4">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="min-w-0 truncate font-mono" title={value}>
                {value}
              </dd>
            </div>
          ))}
        </dl>
      )
    }
  }
}
