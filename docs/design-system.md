# Design System

Evolution Engine has one visual language: hard edges, a dark neutral palette, and depth built from tonal elevation and deep shadows. The palette and shadows are the default dark theme of [T3 Code](https://github.com/pingdotgg/t3code). `src/index.css` is the source of truth for every token below.

## Principles

1. **Hard edges everywhere.** Nothing has a border radius: not components, images, inputs or scrollbars.
2. **Neutral with one color.** Every token has zero chroma except `destructive`, which is red.
3. **Controls are quiet.** Text buttons are a `surface` fill with an `edge` outline and `foreground` text. Icon buttons have no box: a bare `muted-foreground` icon that turns `foreground` on hover. There is no destructive button.
4. **Dark only.** There is no light theme and no theme switching.
5. **Controls are flat.** Text buttons and the active tab are a fill and an edge, with no shadow, and show a pointer cursor. Controls do not animate. Surfaces sit one step above the page and are separated from it by a hairline and a shadow.
6. **Few variants.** Buttons have one text style and one icon style. Badges, alerts and menu items have a default and a destructive variant only. Add a variant only when a screen genuinely needs it.
7. **Text or icon, never both.** A button holds either a text label or a single icon with an `aria-label`. Buttons do not get tooltips. Menu items and alerts are text only.
8. **Focus is one line.** Focus brightens the existing border to `border-ring`. Never add a ring or outline on top of a border.

## Colors

There are nine colors and no others.

| Token | Use |
| --- | --- |
| `background` | The page, the dialog scrim, and the pressed fill of a button |
| `surface` | Cards, overlays, the sidebar, text buttons and inputs |
| `muted` | Badges, and hovered or highlighted rows |
| `foreground` | Primary text, and text on `destructive` |
| `muted-foreground` | Secondary text, labels, placeholders, icon buttons, and skeletons at 15% |
| `border` | Hairlines on surfaces |
| `edge` | Control, field and overlay outlines, separators, and scrollbar thumbs |
| `ring` | Focus, the hovered edge of a text button, and the hovered scrollbar thumb |
| `destructive` | Destructive badges, alerts and menu items |

## T3 Code parity

Each token takes the value of its counterpart in T3 Code's default dark theme (`apps/web/src/index.css`).

| Token | T3 Code | Value |
| --- | --- | --- |
| `background` | `--background` | neutral-950 |
| `surface` | `--card`, `--popover` | `background` mixed with 3% white |
| `muted` | `--accent` | white at 4% |
| `foreground` | `--foreground` | neutral-100 |
| `muted-foreground` | `--muted-foreground` | neutral-500 mixed with 10% white |
| `border` | `--border` | white at 6% |
| `edge` | `--input` | white at 8% |
| `destructive` | `--destructive` | red-500 mixed with 10% white |
| `shadow-sunken` | Field highlight | A white 6% top edge |
| `shadow-raised` | `--shadow-composer-dark` | `0 14px 32px -18px` black at 75% |
| `shadow-overlay` | `dialog-glass` | A white 4% top edge over `0 24px 72px -20px` black at 90% |

Three parts of T3 Code are left out because they break the principles above: its border radius, its glass blur, and its blue `--primary`. T3 Code uses that blue for `--ring`, so `ring` is white at 42% instead.

## Elevation

Every raised layer is `bg-surface`; the shadow sets its height.

| Layer | Shadow | Use |
| --- | --- | --- |
| Sunken | `shadow-sunken` | Inputs, selects, tab tracks, wells |
| Base | none (`bg-background`) | The application canvas |
| Docked | none, `border-border` | The sidebar, resizable from its right edge |
| Raised | `shadow-raised` | Cards, panels, alerts |
| Overlay | `shadow-overlay` | Menus, dialogs, tooltips, select lists |
| Control | none, `border-edge` | Text buttons, the active tab |

## Title bar

The window has no native title bar and the app has no header. The operating system draws only the window controls, over the top-right corner of the page, in `background` and `foreground`.

- The top 48px of every view is made of `titlebar` elements: the sidebar's top row and an empty strip above the chat. The utility makes them the drag handle for the window, matches their height to the window controls, and insets them past the macOS window buttons.
- Links, buttons and fields inside a `titlebar` stay clickable. Anything else inside it drags the window.
- Keep controls out of the right end of a `titlebar`, where the window controls sit. Their 48px height is set in `src/main/window.ts`.

## Enforcement

- The Tailwind theme resets the `color`, `radius` and `shadow` namespaces, so only the tokens above generate CSS. `shadcn/no-unknown-classes` reports anything else, such as `bg-red-500`, `rounded-xl` or `shadow-lg`.
- An ESLint `no-restricted-syntax` rule rejects any `rounded` utility in renderer code, including `rounded-none`, `rounded-full` and arbitrary values.
- A base-layer `border-radius: 0 !important` squares off native and third-party elements that bypass the class rules.

## Adding shadcn components

Components generated by the shadcn CLI arrive with the default styling. Before committing one:

1. Remove every `rounded-*` class.
2. Map shadows to the elevation table: fields become `bg-surface shadow-sunken`, surfaces become `shadow-raised` or `shadow-overlay`, and anything clickable becomes a control.
3. Remove every `ring-*` focus style and use `focus-visible:border-ring` instead.
4. Collapse variants and sizes to the ones the app needs.
5. Replace any non-token color with the closest token from the tables above. `black` and `white` are not tokens, and lint does not always flag them (for example `bg-black/10`), so search for them explicitly.
6. Add a showcase for it to `src/renderer/views/visual-components-view.tsx`.
7. Run `npm run check`.
8. Check any `data-horizontal` or `data-vertical` selectors. Base UI sets `data-orientation`, so use `data-[orientation=horizontal]` instead.

## Component gallery

Every canonical component in `src/renderer/components/ui` is shown in the Visual Components view, with all of its variants, sizes and states.

- In the development app, open DevTools with `F12` or `Ctrl+Shift+I` (`Cmd+Opt+I` on macOS) and run `ShowVisualComponentsView()` in the console.
- Run `ShowDefaultView()` to return to the application.
- Both functions exist only in development builds.
