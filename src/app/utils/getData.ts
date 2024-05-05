import { faker } from '@faker-js/faker'
import PictureI, { PictureDetailI } from '@shared/interfaces/pictureI'
import ShortUniqueId from 'short-unique-id'

const uid = new ShortUniqueId({ length: 10 });

// функция генерации массива чисел от 1 до `len + 1`
const range = (len: number) => {
    const arr = []
    for (let i = 1; i < len + 1; i++) {
        arr.push(genId())
    }
    return arr
}

// функция генерации id
export const genId = () => uid.rnd()

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
export const createPicture = (id: string): PictureI => {
    const now = new Date().toLocaleString()
    const details: PictureDetailI[] = range(randInt(0, 10)).map(createPictureDetail)
    const detilesSumTotal = details.reduce((accumulator, pd) => { return accumulator + pd.price }, 0)
    const pricePerHour = 2
    const hoursSpent = randInt(5, 50)

    const v: PictureI = {
        id: id,
        created: now,
        updated: randInt(0, 1) ? now : undefined,
        height: randInt(10, 300),
        width: randInt(10, 300),
        diamondForm: randInt(0, 1) ? 'circle' : 'square',
        coverageArea: randInt(0, 1) ? 'total' : 'partial',
        details: details,
        detailsSumTotal: detilesSumTotal,

        pricePerHour: pricePerHour,
        hoursSpent: hoursSpent,
        forHoursSpentTotal: hoursSpent * pricePerHour,

        bayFullPrice: detilesSumTotal + randInt(5, 50),

        comment: faker.string.alpha({ length: { min: 0, max: 50 } })
    }

    return v
}

// функция генерации фиктивных данных в виде массива объектов пользователя заданной длины
const getData = (len: number) => range(len).map(createPicture)

export default getData