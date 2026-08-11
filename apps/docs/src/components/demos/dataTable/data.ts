export type DataTableDemoItem = {
    id: number
    name: string
    category: string
    status: "Active" | "Draft" | "Archived"
    calories: number
    fat: number
    protein: number
    region: string
    createdAt: string
    selectable: boolean
    metrics: { revenue: number; orders: number }
}

const categories = ["Ice cream", "Pastry", "Cookie"] as const
const regions = ["North", "South", "East", "West"] as const
const statuses = ["Active", "Draft", "Archived"] as const

export const dataTableDemoItems: DataTableDemoItem[] = Array.from({ length: 120 }, (_, index) => ({
    id: index + 1,
    name: `Dessert ${String(index + 1).padStart(3, "0")}`,
    category: categories[index % categories.length]!,
    status: statuses[index % statuses.length]!,
    calories: 120 + (index * 19) % 360,
    fat: 1 + (index * 7) % 24,
    protein: 2 + (index * 5) % 20,
    region: regions[index % regions.length]!,
    createdAt: `2026-${String(index % 12 + 1).padStart(2, "0")}-${String(index % 28 + 1).padStart(2, "0")}`,
    selectable: index % 11 !== 0,
    metrics: { revenue: 1500 + index * 235, orders: 10 + index * 3 },
}))

export const standardHeaders = [
    { key: "name", title: "Dessert", sortable: true, minWidth: 180 },
    { key: "category", title: "Category", sortable: true },
    { key: "status", title: "Status", sortable: true },
    { key: "calories", title: "Calories", align: "end" as const, sortable: true },
    { key: "fat", title: "Fat (g)", align: "end" as const, sortable: true },
]
