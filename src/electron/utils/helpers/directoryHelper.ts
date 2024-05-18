import fs from 'fs'
import { IMAGES_PATH } from '@general/consts'


export default class DirectoryHelper {
    private constructor() { }

    public static createFolderIfNeed() {
        const path = IMAGES_PATH
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path)
            console.log(`Folder ${path} created successfully!`)
        }
    }
}