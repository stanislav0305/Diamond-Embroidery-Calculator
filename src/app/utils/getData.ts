import { faker } from '@faker-js/faker'
import PictureI, { PictureDetailI } from '@shared/interfaces/pictureI'

// функция генерации массива чисел от 1 до `len + 1`
const range = (len: number) => {
    const arr = []
    for (let i = 1; i < len + 1; i++) {
        arr.push(i)
    }
    return arr
}

// функция генерации id
let _id = 1
export const genId = () => _id++

// функция, возвращающая случайное целое число в заданном диапазоне
const randInt = (min: number, max: number) =>
    Math.floor(min + Math.random() * (max - min + 1))


const createPictureDetail = () => {
    const v: PictureDetailI = {
        id: genId(),
        name: faker.company.name(),
        price: randInt(1, 20)
    }

    return v
}

// функция генерации данных PictureEntity
export const createPicture = (id: number): PictureI => {
    const details: PictureDetailI[] = range(randInt(0, 10)).map(createPictureDetail)
    const detilesSumTotal = details.reduce((accumulator, pd) => {
        return accumulator + pd.price
    }, 0)

    const v: PictureI = {
        id: id,
        height: randInt(10, 300),
        width: randInt(10, 300),
        diamondForm: randInt(0, 1) ? 'circle' : 'square',
        coverageArea: randInt(0, 1) ? 'total' : 'partial',
        details: details,
        detailsSumTotal: detilesSumTotal,

        pricePerHour: 2,
        hoursSpent: randInt(5, 50),

        bayFullPrice: detilesSumTotal + randInt(5, 50),

        comment: faker.string.alpha({ length: { min: 0, max: 50 } })
    }

    return v
}

// функция генерации фиктивных данных в виде массива объектов пользователя заданной длины
const getData = (len: number) => range(len).map(createPicture)

export default getData