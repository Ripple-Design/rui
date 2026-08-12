function normalizeAngle(angle: number) {
    return ((angle % 360) + 360) % 360
}

export function getClockAngle(x: number, y: number, rect: DOMRect) {
    const radians = Math.atan2(y - rect.top - rect.height / 2, x - rect.left - rect.width / 2)
    return normalizeAngle((radians * 180) / Math.PI + 90)
}

export function getShortestAngleTarget(current: number, target: number) {
    const normalizedCurrent = normalizeAngle(current)
    const normalizedTarget = normalizeAngle(target)
    const delta = ((normalizedTarget - normalizedCurrent + 540) % 360) - 180
    return current + delta
}

export function getMinuteFromAngle(angle: number, snapToFiveMinutes: boolean) {
    const minute = Math.round(normalizeAngle(angle) / 6) % 60
    return snapToFiveMinutes ? Math.round(minute / 5) * 5 % 60 : minute
}

export function getHourFromAngle(angle: number, timeFormat: "12h" | "24h") {
    const step = timeFormat === "12h" ? 30 : 15
    const hour = Math.round(normalizeAngle(angle) / step) % (timeFormat === "12h" ? 12 : 24)
    return timeFormat === "12h" ? hour || 12 : hour
}
