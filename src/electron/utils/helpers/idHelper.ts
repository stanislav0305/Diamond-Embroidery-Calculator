import ShortUniqueId from 'short-unique-id'


export default class IdHelper {
    private static uid = new ShortUniqueId({ length: 10 })

    static genId(): string {
        return IdHelper.uid.rnd()
    }
}