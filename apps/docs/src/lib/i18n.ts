import type { Locale } from "./docs"

export const labels: Record<Locale, Record<string, string>> = {
    en: {
        spec: "Spec",
        guidelines: "Guidelines",
        implementation: "Implementation",
        components: "Components",
        icons: "Icons",
    },
    "zh-cn": {
        spec: "规范",
        guidelines: "指南",
        implementation: "实现",
        components: "组件",
        icons: "图标",
    },
}

export function getLabel(key: string, locale: Locale): string {
    return labels[locale][key] ?? labels.en[key] ?? key
}
