import { faker } from '@faker-js/faker'
import PictureI, { PictureDetileI } from '@shared/interfaces/pictureI'

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
const id = () => _id++

// функция, возвращающая случайное целое число в заданном диапазоне
const randInt = (min: number, max: number) =>
    Math.floor(min + Math.random() * (max - min + 1))


const createPictureDetile = () => {
    const v: PictureDetileI = {
        name: faker.company.name(),
        price: randInt(1, 20)
    }

    return v
}

// функция генерации данных PictureEntity
export const createPicture = (idVal: number | undefined) => {
    const detilesSumTotal = randInt(0, 20)

    const v: PictureI = {
        id: idVal ?? id(),
        height: randInt(10, 300),
        width: randInt(10, 300),
        diamondForm: randInt(0, 1) ? 'circle' : 'square',
        coverageArea: randInt(0, 1) ? 'total' : 'partial',
        detiles: range(randInt(0, 10)).map(createPictureDetile),
        detilesSumTotal: detilesSumTotal,

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