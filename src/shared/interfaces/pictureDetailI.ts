import * as Yup from 'yup'
import BaseI from '@shared/interfaces/baseI'


export default interface PictureDetailI extends BaseI {
    name: string
    price: number
}

export const pictureDetailDefault: PictureDetailI = {
    id: '',
    name: '',
    price: 0
}

export const pictureDetailISchema = Yup.object().shape({
    id: Yup.string()
        .default(''),
    name: Yup.string()
        .required('Обязательное поле'),
    price: Yup.number()
        .required('Обязательное поле')
        .min(0, 'Значение должно быть больше или равно 0')
})