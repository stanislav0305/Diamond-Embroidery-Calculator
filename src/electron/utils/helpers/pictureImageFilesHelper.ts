import path from 'path'
import { IMAGES_PATH } from "@general/consts"
import DirectoryHelper from "@mainUtils/helpers/directoryHelper"
import FileHelper from "@mainUtils/helpers/fileHelper"
import PictureImageI from "@shared/interfaces/pictureImageI"
import { ProcessingResult } from '@mainUtils/processingResult'
import { ProcessingResultI } from '@shared/interfaces/ProcessingResultI'


export default class PictureImageFilesHelper {
    public static save(images: PictureImageI[]): [images: PictureImageI[], result: ProcessingResultI] {
        DirectoryHelper.createFolderIfNeed()

        const newImages = [...images]
        const needLoadImages = newImages.filter(i => !i.isLoaded)
        const result = new ProcessingResult(needLoadImages.length)

        needLoadImages.forEach(image => {
            const newFileName = `${image.id}.${image.ext}`
            const newFilePath = path.join(IMAGES_PATH, newFileName)
            const buffer = Buffer.from(image.arrayBuffer)

            image.isLoaded = FileHelper.write(newFilePath, buffer)
            image.isLoaded && result.done++
        })

        const r = {...result,
            notProcessed: result.notProcessed
        } as ProcessingResultI

        return [newImages, r]
    }

    public static remove(images: PictureImageI[]): ProcessingResultI {
        const result = new ProcessingResult(images.length)

        images.forEach(image => {
            const newFileName = `${image.id}.${image.ext}`
            const newFilePath = path.join(IMAGES_PATH, newFileName)
            FileHelper.remove(newFilePath) && result.done++
        })

        const r = {...result,
            notProcessed: result.notProcessed
        } as ProcessingResultI
        
        return r
    }
}