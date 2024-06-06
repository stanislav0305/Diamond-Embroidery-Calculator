import * as Yup from 'yup'
import HistoryI from '@shared/interfaces/historyI'
import DiamondFormType, { diamondFormDefault, diamondForms } from '@shared/types/diamondFormType'
import CoverageAreaType, { coverageAreaDefault, coverageAreas } from '@shared/types/coverageAreaType'
import PictureDetailI, { pictureDetailISchema } from '@shared/interfaces/pictureDetailI'
import PictureImageI, { pictureImageISchema } from '@shared/interfaces/pictureImageI'
import IsSoldType, { isSoldDefault } from '@shared/types/isSoldType'


export default interface PictureI extends HistoryI {
    height: number
    width: number
    diamondForm: DiamondFormType
    coverageArea: CoverageAreaType

    details: PictureDetailI[]
    detailsSumTotal: number

    images: PictureImageI[]

    pricePerHour: number
    hoursSpent: number
    forHoursSpentTotal: number

    bayFullPrice: number
    isSold: IsSoldType

    comment: string
}

export const pictureDefault: PictureI = {
    id: '',
    height: 0,
    width: 0,
    diamondForm: diamondFormDefault,
    coverageArea: coverageAreaDefault,
    details: [],
    detailsSumTotal: 0,
    images: [],
    pricePerHour: 0,
    hoursSpent: 0,
    forHoursSpentTotal: 0,
    bayFullPrice: 0,
    isSold: false,
    comment: '',
    created: new Date().toLocaleString(),
    updated: undefined
}

export const pictureISchema = Yup.object().shape({
    id: Yup.string()
        .default(''),
    height: Yup.number()
        .min(10, 'Значение должно быть больше или равно 10')
        .required('Обязательное поле'),
    width: Yup.number()
        .min(10, 'Значение должно быть больше или равно 10')
        .required('Обязательное поле'),
    diamondForm: Yup.string()
        .oneOf(diamondForms)
        .default(diamondFormDefault)
        .required('Обязательное поле'),
    coverageArea: Yup.string()
        .oneOf(coverageAreas)
        .default(coverageAreaDefault)
        .required('Обязательное поле'),
    details: Yup.array()
        .of(pictureDetailISchema),
    detailsSumTotal: Yup.number()
        .required('Обязательное поле')
        .min(0, 'Значение должно быть больше или равно 0'),
    images: Yup.array()
        .of(pictureImageISchema),
    pricePerHour: Yup.number()
        .min(0, 'Значение должно быть больше или равно 0'),
    hoursSpent: Yup.number()
        .min(0, 'Значение должно быть больше или равно 0'),
    forHoursSpentTotal: Yup.number()
        .required('Обязательное поле'),
    bayFullPrice: Yup.number()
        .min(0, 'Значение должно быть больше или равно 0')
        .required('Обязательное поле'),
    isSold: Yup.boolean()
        .required('Обязательное поле'),
    comment: Yup.string()
})