import * as Yup from 'yup'
import { BaseI } from '@shared/interfaces/baseI'


export default interface PictureImageI extends BaseI {
    name: string,
    type: string,
    ext: string,
    size: number,
    isMain: boolean,
    isLoaded: boolean,
    arrayBuffer: ArrayBuffer
}

export const pictureImageDefault: PictureImageI = {
    id: '',
    name: '',
    type: '',
    ext: '',
    size: 0,
    isMain: false,
    isLoaded: false,
    arrayBuffer: {} as ArrayBuffer
}

export const pictureImageISchema = Yup.object().shape({
    id: Yup.string()
        .default('')
        .required('Обязательное поле'),
    name: Yup.string(),
    type: Yup.string(),
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
    arrayBuffer: Yup.object()
})