import { DropdownOption } from 'material-react-table'


export default class MapToArrayConverter {

    public static toDropdownOptionsValues<K, V extends string>(map: Map<K, V>): DropdownOption[] {
        const z: DropdownOption[] = []
        map.forEach((value: V) => {
            z.push({ label: value, value: value })
        })

        return z
    }

    public static toDropdownOptions<K, V extends string>(map: Map<K, V>): DropdownOption[] {
        const z: DropdownOption[] = []
        map.forEach((value: V, key: K) => {
            z.push({ label: value, value: key })
        })

        return z
    }
}