import * as iconPaths from "@ripple-design/icons"
import iconsData from "@docs/data/icons-data.json"

export type IconRecord = {
    name: string
    version: number
    popularity: number
    codepoint: number
    unsupported_families: string[]
    categories: string[]
    tags: string[]
    sizes_px: number[]
}

export type IconVariant = "filled" | "outlined" | "rounded" | "sharp" | "twotone"

const icons = (iconsData as { icons: IconRecord[] }).icons

export function getIconCount() {
    return icons.length
}

export function groupIconsByCategory() {
    const groups = new Map<string, IconRecord[]>()

    for (const icon of icons) {
        const category = icon.categories[0] ?? "other"
        const bucket = groups.get(category) ?? []
        bucket.push(icon)
        groups.set(category, bucket)
    }

    return [...groups.entries()]
        .map(([category, items]) => ({
            category,
            items: items.sort((a, b) => a.name.localeCompare(b.name)),
        }))
        .sort((a, b) => a.category.localeCompare(b.category))
}

export function getIconPath(name: string, variant: IconVariant = "filled") {
    const exportName = `RI${toPascalCase(name)}${toVariantSuffix(variant)}` as keyof typeof iconPaths
    return iconPaths[exportName] as string | undefined
}

export function toPascalCase(value: string) {
    return value
        .split(/[^a-zA-Z0-9]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("")
}

function toVariantSuffix(variant: IconVariant) {
    switch (variant) {
        case "filled":
            return "Filled"
        case "outlined":
            return "Outlined"
        case "rounded":
            return "Rounded"
        case "sharp":
            return "Sharp"
        case "twotone":
            return "TwoTone"
    }
}
