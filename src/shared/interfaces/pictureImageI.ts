import * as Yup from 'yup'
import { BaseI } from '@shared/interfaces/baseI'


export default interface PictureImageI extends BaseI {
    ext: string,
    size: number,
    isMain: boolean,
    isLoaded: boolean,
    file: File
}

export const pictureImageDefault: PictureImageI = {
    id: '',
    ext: '',
    size: 0,
    isMain: false,
    isLoaded: false,
    file: {} as File
}

export const pictureImageISchema = Yup.object().shape({
    id: Yup.string()
        .default('')
        .required('Обязательное поле'),
    ext: Yup.string()
        .default(''),
    size: Yup.number()
        .min(0, 'Значение должно быть больше или равно 0')
        .required('Обязательное поле'),
    isMain: Yup.boolean()
        .required('Обязательное поле')
        .default(false),
    isLoaded: Yup.boolean()
        .default(false),
    file: Yup.object()
})