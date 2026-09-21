import type { Locale } from "./docs"

export const labels: Record<Locale, Record<string, string>> = {
    en: {
        spec: "Spec",
        guidelines: "Guidelines",
        implementation: "Implementation",
        components: "Components",
        icons: "Icons",
        "on-this-page": "On this page",
        "no-subsection-headings": "No subsection headings yet.",
    },
    "zh-cn": {
        spec: "规范",
        guidelines: "指南",
        implementation: "实现",
        components: "组件",
        icons: "图标",
        "on-this-page": "本页内容",
        "no-subsection-headings": "暂无小节标题。",
    },
}

export function getLabel(key: string, locale: Locale): string {
    return labels[locale][key] ?? labels.en[key] ?? key
}
