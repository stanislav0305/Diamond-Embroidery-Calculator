import { MINUTES_IN_HOUR, MINUTES_SEPARATOR } from "@shared/consts"

export type TimeFormat = 'HH:mm' | 'HHHHH:mm'

export default class TimeHelper {
    public static parseTimeString = (value: string, format: TimeFormat) => {
        const [hoursRaw, minutesRaw] = value.split(MINUTES_SEPARATOR, 2)
        let hours = format === 'HH:mm' ? parseInt(hoursRaw || '00', 10) : parseInt(hoursRaw || '0', 10)
        const minutes = parseInt(minutesRaw || '00', 10)

        if (format === 'HH:mm') {
            hours = hours > 23 ? 23 : hours
        }

        const totalInMinutes = TimeHelper.toMinutes(hours) + minutes
        const totalInHours = hours + TimeHelper.toHoures(minutes)

        return { totalInMinutes, totalInHours, hoursRaw, minutesRaw }
    }

    public static formatTimeToStrings = (time: number, format: TimeFormat): { hoursStr: string, minutesStr: string } => {
        let hours = Math.floor(time / MINUTES_IN_HOUR)
        const minutes = Math.floor(time % MINUTES_IN_HOUR)

        if (format === 'HH:mm') {
            hours = hours > 23 ? 23 : hours
            return {
                hoursStr: hours.toString().padStart(2, '0'),
                minutesStr: minutes.toString().padStart(2, '0')
            }
        }
        else {
            return {
                hoursStr: hours.toString(),
                minutesStr: minutes.toString().padStart(2, '0')
            }
        }
    }

    public static formatTimeToString = (time: number, format: TimeFormat) => {
        const { hoursStr, minutesStr } = TimeHelper.formatTimeToStrings(time, format)
        return `${hoursStr}:${minutesStr}`
    }

    public static sub(fromInMinutes: number, toInMinutes: number): number {
        if (fromInMinutes === 0 || toInMinutes === 0)
            return 0

        return toInMinutes >= fromInMinutes
            ? toInMinutes - fromInMinutes
            : TimeHelper.toMinutes(24) - (fromInMinutes - toInMinutes)
    }

    public static toHoures(minutes: number): number {
        return minutes / MINUTES_IN_HOUR
    }

    public static toMinutes(hours: number): number {
        return hours * MINUTES_IN_HOUR
    }
}
