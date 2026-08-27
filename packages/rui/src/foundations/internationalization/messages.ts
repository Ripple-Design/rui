import { resolveInternationalizationLocaleCandidates } from "./resolve"

import type { RInternationalizationMessageCatalog, RInternationalizationMessages } from "./types"

const baseMessages: RInternationalizationMessages = {
    "data-table.all": "All",
    "data-table.first-page": "First page",
    "data-table.items-per-page": "Rows per page:",
    "data-table.last-page": "Last page",
    "data-table.next-page": "Next page",
    "data-table.page-text": "{0}-{1} of {2}",
    "data-table.prev-page": "Previous page",
    "form.optional": " (Optional)",
    "form.required": " Required",
}
const messageCatalog: RInternationalizationMessageCatalog = {
    "zh-CN": {
        "data-table.all": "全部",
        "data-table.first-page": "首页",
        "data-table.items-per-page": "每页行数：",
        "data-table.last-page": "末页",
        "data-table.next-page": "下一页",
        "data-table.page-text": "{0}-{1}，共 {2} 条",
        "data-table.prev-page": "上一页",
        "form.optional": "（选填）",
        "form.required": "必填",
    },
}

export function resolveBuiltInInternationalizationMessage(locale: string, key: string) {
    for (const candidate of resolveInternationalizationLocaleCandidates(locale)) {
        const message = messageCatalog[candidate]?.[key]
        if (message !== undefined) {
            return message
        }
    }

    return baseMessages[key]
}
