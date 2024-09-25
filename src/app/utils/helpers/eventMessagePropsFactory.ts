import { EventMessagePropsI } from "@components/event-message"
import ShortUniqueId from "short-unique-id"

export type EventMessageTyepe = 'PictureCreated' | 'PictureUpdated' | 'PictureRemoved'
    | 'PictureFilesLoaded' | 'PictureFilesRemoved' | 'PictureFilesDonwnloaded'
    | 'PicturesDefaultSetSaved'

const baseModel = {
    show: true,
    secAgo: 0,
} as EventMessagePropsI

export default class EventMessagePropsFactory {

    public static getProps(t: EventMessageTyepe, onClose: (id: string, e?: React.MouseEvent | React.KeyboardEvent) => void,
        hasError: boolean, errorDescription: string | undefined, additionalDescription: string | undefined) {

        let props = this.addBasePropsPart(onClose, hasError, errorDescription, additionalDescription)
        props = this.addMainPropsPart(props, t)
        props = this.addErrorPropsPart(props)

        return props as EventMessagePropsI
    }

    static addBasePropsPart(onClose: (id: string, e?: React.MouseEvent | React.KeyboardEvent) => void, hasError: boolean,
        errorDescription: string | undefined, additionalDescription: string | undefined) {
        const uid = new ShortUniqueId({ length: 10 })
        const props = Object.assign({ ...baseModel }, {
            id: uid.rnd(),
            hasError,
            errorDescription,
            additionalDescription,
            onClose: onClose,
        })

        return props as EventMessagePropsI
    }

    static addMainPropsPart(p: EventMessagePropsI, t: EventMessageTyepe) {
        switch (t) {
            case 'PictureCreated': return this.getPictureCreatedProps(p)
            case 'PictureUpdated': return this.getPictureUpdatedProps(p)
            case 'PictureRemoved': return this.getPictureRemovedProps(p)
            case 'PictureFilesLoaded': return this.getPictureFilesLoadedProps(p)
            case 'PictureFilesRemoved': return this.getPictureFilesRemovedProps(p)
            case 'PictureFilesDonwnloaded': return this.getPictureFilesDonwnloadedProps(p)
            case 'PicturesDefaultSetSaved': return this.getPicturesDefaultSetSavedProps(p)
        }
    }

    static addErrorPropsPart(p: EventMessagePropsI) {
        if (p.hasError) {
            return Object.assign({ ...p }, {
                action: 'error',
                variant: 'danger',
                description: p.errorDescription ?? 'Произошла ошибка! Данные не изменены коректно.',
            } as EventMessagePropsI)
        }

        return p as EventMessagePropsI
    }

    static getPictureCreatedProps(p: EventMessagePropsI) {
        return Object.assign({ ...p }, {
            action: 'created',
            variant: 'success',
            title: 'Добавление картины',
            description: 'Картина добавлена!',
            errorDescription: p.errorDescription ?? 'Произошла ошибка! Данные картины не сохранены коректно.'
        } as EventMessagePropsI)
    }

    static getPictureUpdatedProps(p: EventMessagePropsI) {
        return Object.assign({ ...p }, {
            action: 'updated',
            variant: 'success',
            title: 'Редактирование картины',
            description: 'Картина сохранена!',
            errorDescription: p.errorDescription ?? 'Произошла ошибка! Данные картины не сохранены коректно.'
        } as EventMessagePropsI)
    }

    static getPictureRemovedProps(p: EventMessagePropsI) {
        return Object.assign({ ...p }, {
            action: 'removed',
            variant: 'success',
            title: 'Удаление картины',
            description: 'Картина удалена!',
            errorDescription: p.errorDescription ?? 'Произошла ошибка! Удаление картины не прошло коректно.'
        } as EventMessagePropsI)
    }

    static getPictureFilesLoadedProps(p: EventMessagePropsI) {
        return Object.assign({ ...p }, {
            action: 'info',
            variant: 'success',
            title: 'Загрузка изображений картины',
            description: 'Все изображения загружены успешно! ' + (p.additionalDescription ?? ''),
            errorDescription: p.errorDescription ?? 'Произошла ошибка!'
        } as EventMessagePropsI)
    }

    static getPictureFilesRemovedProps(p: EventMessagePropsI) {
        return Object.assign({ ...p }, {
            action: 'info',
            variant: 'success',
            title: 'Удаление изображений картины',
            description: 'Все изображения удалены успешно! ' + (p.additionalDescription ?? ''),
            errorDescription: p.errorDescription ?? 'Произошла ошибка!'
        } as EventMessagePropsI)
    }

    static getPictureFilesDonwnloadedProps(p: EventMessagePropsI) {
        return Object.assign({ ...p }, {
            action: 'info',
            variant: 'success',
            title: 'Загрузка изображения картины',
            description: 'Изображения загружено успешно! ' + (p.additionalDescription ?? ''),
            errorDescription: p.errorDescription ?? 'Произошла ошибка!'
        } as EventMessagePropsI)
    }

    static getPicturesDefaultSetSavedProps(p: EventMessagePropsI) {
        p.additionalDescription
        return Object.assign({ ...p }, {
            action: 'updated',
            variant: 'success',
            title: 'Редактирование данных по умолчанию',
            description: 'Данные сохранены!',
            errorDescription: p.errorDescription ?? 'Произошла ошибка! Данные по умолчанию не сохранены коректно.'
        } as EventMessagePropsI)
    }
}