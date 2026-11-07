export const locales = ["en", "zh-cn"] as const
export type Locale = (typeof locales)[number]
export type ReadingMode = "design" | "develop"
export type DocTab = "spec" | "guidelines" | "implementation"

export type OutlineItem = {
    slug: string
    text: string
    depth: number
}

export type ComponentsNavigationItem = {
    href: string
    label: string
    value: string
}

export type ComponentsNavigationGroup = {
    group: string
    items: ComponentsNavigationItem[]
}

export type ComponentsNavigation = {
    activeValue: string
    groups: ComponentsNavigationGroup[]
}

export type DirectionMode = "ltr" | "rtl"

export type TocLink = {
    id: string
    depth: number
    text: string
    children?: TocLink[]
}

export type TableOfContents = {
    title?: string
    depth?: number
    links?: TocLink[]
}

export type DocsEntry = {
    path: string
    title: string
    docSlug: string
    tab: DocTab
    locale: Locale
    designOrder: number
    developOrder: number
    api: string
    body?: TableOfContents
}

export type ApiEntry = {
    path: string
    title: string
    routeSlug: string
    locale: Locale
    docs: string
    designOrder: number
    developOrder: number
}

type OrderedEntry = {
    designOrder: number
    developOrder: number
}

type NavGroup = {
    group: string
    items: DocsEntry[]
}

export function isLocale(value: string): value is Locale {
    return locales.includes(value as Locale)
}

export function isDocTab(value: string): value is DocTab {
    return ["spec", "guidelines", "implementation"].includes(value)
}

export function getReadingMode(url: URL): ReadingMode {
    const mode = url.searchParams.get("mode")
    return mode === "develop" ? "develop" : "design"
}

export function getDirectionMode(url: URL): DirectionMode {
    const dir = url.searchParams.get("dir")
    return dir === "rtl" ? "rtl" : "ltr"
}

export function sortByMode<T extends OrderedEntry>(items: T[], mode: ReadingMode) {
    const key = mode === "develop" ? "developOrder" : "designOrder"
    return [...items].sort((a, b) => a[key] - b[key])
}

export function getModeUrl(url: URL, mode: ReadingMode) {
    const next = new URL(url)
    next.searchParams.set("mode", mode)
    return `${next.pathname}${next.search}`
}

export function getLocaleUrl(url: URL, locale: Locale) {
    const next = new URL(url)
    const segments = next.pathname.split("/").filter(Boolean)

    if (segments.length > 0 && isLocale(segments[0])) {
        segments[0] = locale
    } else {
        segments.unshift(locale)
    }

    next.pathname = `/${segments.join("/")}`
    return `${next.pathname}${next.search}`
}

function getDocsGroup(docSlug: string) {
    if (docSlug === "getting-started") return "Getting started"
    if (docSlug.startsWith("components/")) return "Components"
    return "Guides"
}

export function groupDocs(entries: DocsEntry[], locale: string, mode: ReadingMode): NavGroup[] {
    const grouped = new Map<string, DocsEntry[]>()
    const localized = sortByMode(
        entries.filter((item) => item.locale === locale && item.tab === "spec"),
        mode,
    )

    for (const entry of localized) {
        const group = getDocsGroup(entry.docSlug)
        const bucket = grouped.get(group) ?? []
        bucket.push(entry)
        grouped.set(group, bucket)
    }

    const collator = new Intl.Collator(locale, { numeric: true, sensitivity: "base" })

    return [...grouped.entries()].map(([group, items]) => ({
        group,
        items:
            group === "Components"
                ? [...items].sort(
                      (left, right) =>
                          collator.compare(left.title, right.title) ||
                          left.docSlug.localeCompare(right.docSlug),
                  )
                : items,
    }))
}

export function groupApi(entries: ApiEntry[], locale: string, mode: ReadingMode) {
    return sortByMode(
        entries.filter((item) => item.locale === locale),
        mode,
    )
}

export function getTabsForDoc(entries: DocsEntry[], locale: string, docSlug: string) {
    const tabOrder: DocTab[] = ["spec", "guidelines", "implementation"]
    const localized = entries.filter((item) => item.locale === locale && item.docSlug === docSlug)

    return tabOrder
        .map((tab) => localized.find((item) => item.tab === tab))
        .filter((item): item is DocsEntry => Boolean(item))
}

function collectOutlineLinks(links: TocLink[] | undefined, outline: OutlineItem[]) {
    for (const link of links ?? []) {
        if (link.depth === 2 || link.depth === 3) {
            outline.push({
                slug: link.id,
                text: link.text,
                depth: link.depth,
            })
        }

        collectOutlineLinks(link.children, outline)
    }
}

export function extractOutline(entry: DocsEntry | null | undefined): OutlineItem[] {
    const outline: OutlineItem[] = []
    collectOutlineLinks(entry?.body?.toc?.links, outline)
    return outline
}
