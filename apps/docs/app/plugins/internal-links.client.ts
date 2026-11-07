// RUI components render plain anchors, so Nuxt's router never sees their clicks.
// Intercept same-origin anchor navigation and route it through Vue Router instead
// of letting the browser reload the whole document.
export default defineNuxtPlugin(() => {
    const router = useRouter()

    function onClick(event: MouseEvent) {
        if (event.defaultPrevented || event.button !== 0) {
            return
        }

        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return
        }

        const target = event.target

        if (!(target instanceof Element)) {
            return
        }

        const anchor = target.closest("a")

        if (!anchor) {
            return
        }

        if (anchor.target && anchor.target !== "_self") {
            return
        }

        if (anchor.hasAttribute("download")) {
            return
        }

        const href = anchor.getAttribute("href")

        if (!href || href.startsWith("#")) {
            return
        }

        const url = new URL(anchor.href, window.location.href)

        if (url.origin !== window.location.origin) {
            return
        }

        if (url.protocol !== "http:" && url.protocol !== "https:") {
            return
        }

        // Let the browser handle same-page hash navigation.
        if (
            url.pathname === window.location.pathname &&
            url.search === window.location.search &&
            url.hash
        ) {
            return
        }

        event.preventDefault()
        void router.push(`${url.pathname}${url.search}${url.hash}`)
    }

    window.addEventListener("click", onClick)
})
