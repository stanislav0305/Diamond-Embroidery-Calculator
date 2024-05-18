import * as Yup from 'yup'
import PictureDetailI, { pictureDetailISchema } from '@shared/interfaces/pictureDetailI'


export default interface PicturesDefaultSetI {
    details: PictureDetailI[]
    detailsSumTotal: number
    pricePerHour: number
}

export const picturesDefaultSetDefault: PicturesDefaultSetI = {
    details: [],
    detailsSumTotal: 0,
    pricePerHour: 0
}

export const picturesDefaultSetDefaultISchema = Yup.object().shape({
    details: Yup.array()
        .of(pictureDetailISchema),
    detailsSumTotal: Yup.number()
        .required('Обязательное поле')
        .min(0, 'Значение должно быть больше или равно 0'),
    pricePerHour: Yup.number()
        .required('Обязательное поле')
        .min(0, 'Значение должно быть больше или равно 0')
})