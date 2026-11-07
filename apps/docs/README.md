# Ripple Design docs

Nuxt 4 + Nuxt Content v3 (MDC) + `@nuxtjs/i18n` documentation site for Ripple Design UI.

## Commands

```sh
pnpm dev        # nuxt dev
pnpm build      # nuxt generate -> .output/public
pnpm build:ssr  # nuxt build -> .output/server
pnpm preview    # nuxt preview
```

## Content

- `content/docs/<locale>/<docSlug>/<tab>.md`
- `content/api/<locale>/<routeSlug>.md`

Demos are rendered with MDC:

```md
::demo-block{title="Button variants" demo="ButtonBasicDemo"}
::
```

`demo` is the basename of a component in `app/components/demos/`.
