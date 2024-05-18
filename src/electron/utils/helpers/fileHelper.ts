import fs from 'fs'


export default class FileHelper {
    constructor() { }

    public static copy(src: string, dest: string) {
        try {
            fs.copyFileSync(src, dest)
            console.log(`File ${dest} copied.`)

        } catch (err) {
            console.error(`File from ${src} to ${dest} not copied. Errors: ${JSON.stringify(err)}`)
            return false
        }

        return true
    }

    public static write(newFilePath: string, buffer: Buffer) {
        try {
            fs.writeFileSync(newFilePath, buffer)
            console.log(`File ${newFilePath} saved.`)

        } catch (err) {
            console.error(`File ${newFilePath} not saved. Errors: ${JSON.stringify(err)}`)
            return false
        }

        return true
    }

    public static remove(filePath: string) : boolean {
        try {
            fs.rmSync(filePath, { recursive: false })
            console.log(`File ${filePath} removed.`)
        } catch (err) {
            console.error(`File ${filePath} not removed. Errors: ${JSON.stringify(err)}`)
            return false
        }

        return true
    }
}