import * as Yup from 'yup'
import { HistoryI } from '@shared/interfaces/historyI'
import { BaseI } from '@shared/interfaces/baseI'
import DiamondFormType, { diamondFormDefault, diamondForms } from '@shared/types/diamondFormType'
import CoverageAreaType, { coverageAreaDefault, coverageAreas } from '@shared/types/coverageAreaType'


export default interface PictureI extends HistoryI {
    height: number
    width: number
    diamondForm: DiamondFormType
    coverageArea: CoverageAreaType //площадь покрытия

    details: PictureDetailI[]
    detailsSumTotal: number

    pricePerHour: number
    hoursSpent: number
    forHoursSpentTotal: number

    bayFullPrice: number

    comment: string
}

export interface PictureDetailI extends BaseI {
    name: string
    price: number
}

export const pictureDefault: PictureI = {
    id: '',
    height: 0,
    width: 0,
    diamondForm: diamondFormDefault,
    coverageArea: coverageAreaDefault,
    details: [],
    detailsSumTotal: 0,
    pricePerHour: 0,
    hoursSpent: 0,
    forHoursSpentTotal: 0,
    bayFullPrice: 0,
    comment: '',
    created: new Date().toLocaleString(),
    updated: undefined
}

export const pictureDetailDefault: PictureDetailI = {
    id: '',
    name: '',
    price: 0
}

export const PictureDetailISchema = Yup.object().shape({
    id: Yup.string()
        .default(''),
    name: Yup.string()
        .required('Обязательное поле'),
    price: Yup.number()
        .required('Обязательное поле'),
})

export const PictureISchema = Yup.object().shape({
    id: Yup.string()
        .default(''),
    height: Yup.number()
        .min(10, 'Значение должно быть меньше или равно 10')
        .required('Обязательное поле'),
    width: Yup.number()
        .min(10, 'Значение должно быть меньше или равно 10')
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
        .of(PictureDetailISchema),
    detailsSumTotal: Yup.number()
        .required('Обязательное поле')
        .min(0, 'Значение должно быть меньше или равно 0'),
    pricePerHour: Yup.number()
        .min(0, 'Значение должно быть меньше или равно 0'),
    hoursSpent: Yup.number()
        .min(0, 'Значение должно быть меньше или равно 0'),
    forHoursSpentTotal: Yup.number()
        .required('Обязательное поле'),
    bayFullPrice: Yup.number()
        .min(0, 'Значение должно быть меньше или равно 0')
        .required('Обязательное поле'),
    comment: Yup.string()
})