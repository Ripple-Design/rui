## Development

The docs app is built with Nuxt 4, Nuxt Content v3 (MDC) and `@nuxtjs/i18n`.

```
pnpm dev            # nuxt dev
pnpm build          # nuxt generate (static output in .output/public)
pnpm build:ssr      # nuxt build (Node server output in .output)
pnpm preview        # nuxt preview
```

`nuxt dev` is a long-running process; run it in the background when working from an agent terminal.

## Content

Content lives in `content/docs/<locale>/<docSlug>/<tab>.md` and `content/api/<locale>/<routeSlug>.md`. Pages are MDC: use `::demo-block{title="..." demo="ButtonBasicDemo"}` for demos and register new content components in `app/components/content/`.

## Documentation

- Nuxt: https://nuxt.com/docs
- Nuxt Content: https://content.nuxt.com
- Nuxt i18n: https://i18n.nuxtjs.org
