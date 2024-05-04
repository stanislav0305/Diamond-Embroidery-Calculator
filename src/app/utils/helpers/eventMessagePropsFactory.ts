import { EventMessagePropsI } from "@components/event-message"
import ShortUniqueId from "short-unique-id";

export type EventMessageTyepe = 'PictureCreated' | 'PictureUpdated' | 'PictureRemoved'

const baseModel = {
    show: true,
    secAgo: 0,
} as EventMessagePropsI

export default class EventMessagePropsFactory {

    public static getProps(t: EventMessageTyepe, onClose: (id: string, e?: React.MouseEvent | React.KeyboardEvent) => void) {
        const uid = new ShortUniqueId({ length: 10 });
        const props = Object.assign(baseModel, {
            elementiId: uid.rnd(),
            onClose: onClose,
        })

        switch (t) {
            case 'PictureCreated': return this.getPictureCreatedProps(props)
            case 'PictureUpdated': return this.getPictureUpdatedProps(props)
            case 'PictureRemoved': return this.getPictureRemovedProps(props)
        }
    }

    static getPictureCreatedProps(p: EventMessagePropsI) {
        return Object.assign(p, {
            action: 'created',
            variant: 'success',
            title: 'Добавление картины',
            description: 'Картина добавлена!',
        })
    }

    static getPictureUpdatedProps(p: EventMessagePropsI) {
        return Object.assign(p, {
            action: 'updated',
            variant: 'success',
            title: 'Редактирование картины',
            description: 'Картина сохронена!',
        })
    }

    static getPictureRemovedProps(p: EventMessagePropsI) {
        return Object.assign(p, {
            action: 'removed',
            variant: 'success',
            title: 'Удаление картины',
            description: 'Картина удалена!',
        })
    }
}