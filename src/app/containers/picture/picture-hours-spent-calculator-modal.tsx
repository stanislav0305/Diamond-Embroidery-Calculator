import React from 'react'
import { Alert, Button, Col, Form, InputGroup, Row, Table } from 'react-bootstrap'
import TimeTextMask from '@components/form/time-text-mask'
import CustomModal, { ModalMode } from '@components/layouts/custom-modal'
import IdHelper from '@shared/helpers/idHelper'
import TimeHelper from '@utils/helpers/timeHelper'


interface PropsI {
    onSaved: (hoursSpent: number) => void
}

interface StateI {
    mode: ModalMode
    items: TimeInMinutesItemI[]
    itemsSumTotal: number
}

interface TimeInMinutesItemI {
    key: string,
    num: number
    byPeriod: boolean
    from: number
    to: number
    amount: number
    total: number
}

const timeItemDefault = {
    key: '',
    num: 0,
    byPeriod: false,
    from: 0,
    to: 0,
    amount: 0,
    total: 0
} as TimeInMinutesItemI

export default class PictureHoursSpentCalculatorModal extends React.Component<PropsI, StateI> {
    constructor(props: PropsI) {
        super(props)

        this.state = {
            mode: 'closed',
            items: [],
            itemsSumTotal: 0
        }
    }

    onOpen = (hoursSpent: number) => {
        this.toogle('loaded', hoursSpent)
    }

    onClose = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        this.toogle('closed')
    }

    onConfirm = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()

        const { itemsSumTotal } = this.state
        const hoursSpent = Math.round(TimeHelper.toHoures(itemsSumTotal))

        this.toogle('closed')
        this.props.onSaved(hoursSpent)
    }

    toogle = (mode: ModalMode = 'closed', hoursSpent?: number) => {
        this.setState(prev => {
            return {
                ...prev,
                mode,
                items: !!hoursSpent ? this.addItem([], 0, TimeHelper.toMinutes(hoursSpent)) : prev.items,
                itemsSumTotal: !!hoursSpent ? TimeHelper.toMinutes(hoursSpent) : prev.itemsSumTotal
            }
        })
    }

    //--------------------------------------------------------------------------------

    onAddItem(event: React.MouseEvent<HTMLButtonElement>, num: number = 0) {
        event.preventDefault()

        this.setState(prev => {
            const newItems = this.addItem(prev.items, num)
            return {
                ...prev,
                items: newItems
            }
        })
    }

    onRemoveItem(event: React.MouseEvent<HTMLButtonElement>, num: number) {
        event.preventDefault()

        this.setState(prev => {
            let newItems = [...prev.items.filter(item => item.num !== num)]
            newItems = this.renumereItems(newItems)

            return {
                ...prev,
                items: newItems,
                itemsSumTotal: this.sumItems(newItems)
            }
        })
    }

    onChangeByPeriod(e: React.ChangeEvent<HTMLInputElement>, num: number) {
        this.setState(prev => {
            const newItems = [...prev.items]
            const index = newItems.findIndex(item => item.num === num)!
            newItems[index].byPeriod = e.target.checked
            newItems[index].total = newItems[index].byPeriod
                ? TimeHelper.sub(newItems[index].from, newItems[index].to)
                : newItems[index].amount

            return {
                ...prev,
                items: newItems,
                itemsSumTotal: this.sumItems(newItems)
            }
        })
    }

    onChangeAmount(num: number, timeInMinutes: number) {
        this.setState(prev => {
            const newItems = [...prev.items]
            const index = newItems.findIndex(item => item.num === num)!
            newItems[index].amount = timeInMinutes
            newItems[index].total = newItems[index].amount

            return {
                ...prev,
                items: newItems,
                itemsSumTotal: this.sumItems(newItems)
            }
        })
    }

    onChangeFrom(num: number, timeInMinutes: number) {
        this.setState(prev => {
            const newItems = [...prev.items]
            const index = newItems.findIndex(item => item.num === num)!
            newItems[index].from = timeInMinutes
            newItems[index].total = TimeHelper.sub(newItems[index].from, newItems[index].to)

            return {
                ...prev,
                items: newItems,
                itemsSumTotal: this.sumItems(newItems)
            }
        })
    }

    onChangeTo(num: number, timeInMinutes: number) {
        this.setState(prev => {
            const newItems = [...prev.items]
            const index = newItems.findIndex(item => item.num === num)!
            newItems[index].to = timeInMinutes
            newItems[index].total = TimeHelper.sub(newItems[index].from, newItems[index].to)

            return {
                ...prev,
                items: newItems,
                itemsSumTotal: this.sumItems(newItems)
            }
        })
    }

    //---------------------------------------------------------------------

    addItem(items: TimeInMinutesItemI[], num: number = 0, amount: number = 0) {
        const newItem: TimeInMinutesItemI = {
            ...timeItemDefault,
            key: IdHelper.genId(),
            num: 1,
            amount,
            total: amount
        } as TimeInMinutesItemI

        let newItems = [] as TimeInMinutesItemI[]

        if (num === 0) {
            //то добавляем в конец таблицы
            newItems = [...items, newItem]
        } else {
            //добавляем в середину таблицы
            const begin = num - 1 >= 0 ? items.slice(0, num) : [] as TimeInMinutesItemI[]
            const end = num < items.length ? items.slice(num, items.length) : [] as TimeInMinutesItemI[]
            newItems = [...begin, newItem, ...end]
        }

        newItems = this.renumereItems(newItems)

        return newItems
    }

    renumereItems(items: TimeInMinutesItemI[]) {
        return items.map((item: TimeInMinutesItemI, index: number) => {
            item.num = index + 1
            return item
        })
    }

    sumItems(items: TimeInMinutesItemI[]) {
        let result = 0
        items.forEach(item => result += item.total)

        return result
    }

    //---------------------------------------------------------------------

    render() {
        const { mode, items, itemsSumTotal } = this.state
        const { hoursStr, minutesStr } = TimeHelper.formatTimeToStrings(itemsSumTotal, 'HHHHH:mm')

        return (
            <CustomModal header='Калькулятор затраченых часов'
                mode={mode}
                confirmBtnText='Сохранить'
                onConfirm={this.onConfirm}
                onClose={this.onClose}
                onHide={this.toogle}>
                <Alert variant='secondary'>
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <span>Введённые здесь строки с временем не будут сохранены. Они будут использоваться для расчета общего
                        количества затраченного времени.</span>
                </Alert>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th className="p-1">
                                <Button as="a"
                                    variant="outline-success"
                                    size="sm"
                                    className='bi bi-plus-square-fill me-1 mt-1'
                                    title='Добавить картинe'
                                    onClick={(e) => this.onAddItem(e)}
                                >
                                </Button>
                            </th>
                            <th>#</th>
                            <th>Время</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => {
                            const { hoursStr, minutesStr } = TimeHelper.formatTimeToStrings(item.total, 'HHHHH:mm')
                            return (
                                <tr key={`time-item-${item.key}`}>
                                    <td className='p-1'>
                                        <Button as="a"
                                            variant="outline-success"
                                            size="sm"
                                            className='bi bi-plus-square-fill me-1 mt-1'
                                            onClick={(e) => this.onAddItem(e, item.num)}
                                        >
                                        </Button>
                                        <Button key={`remove-btn-${item.key}`}
                                            as="a"
                                            variant="outline-danger"
                                            size="sm"
                                            className='bi bi-trash3-fill mt-1'
                                            onClick={(e) => this.onRemoveItem(e, item.num)}
                                        >
                                        </Button>
                                    </td>
                                    <td className='p-1'>{item.num}</td>
                                    <td className='w-50'>
                                        <Row>
                                            <Col>
                                                <Form.Check
                                                    key={`switch-${item.key}`}
                                                    type="switch"
                                                    name="byPeriod-group"
                                                    label="за период"
                                                    defaultChecked={false}
                                                    onChange={e => this.onChangeByPeriod(e, item.num)}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className="text-end">
                                                {!item.byPeriod &&
                                                    <TimeTextMask
                                                        key={`amount-input-${item.key}`}
                                                        format='HHHHH:mm'
                                                        timeInMinutes={item.amount}
                                                        onChangeInMinutes={t => this.onChangeAmount(item.num, t)}
                                                    />
                                                }
                                                {item.byPeriod &&
                                                    <>
                                                        <span className="me-1">с:</span>
                                                        <TimeTextMask
                                                            key={`from-input-${item.key}`}
                                                            format='HH:mm'
                                                            timeInMinutes={item.from}
                                                            onChangeInMinutes={t => this.onChangeFrom(item.num, t)}
                                                        />
                                                    </>
                                                }
                                            </Col>
                                            <Col className="text-end">
                                                {item.byPeriod &&
                                                    <>
                                                        <span className="me-1">до:</span>
                                                        <TimeTextMask
                                                            key={`to-input-${item.key}`}
                                                            format='HH:mm'
                                                            timeInMinutes={item.to}
                                                            onChangeInMinutes={t => this.onChangeTo(item.num, t)}
                                                        />
                                                    </>
                                                }
                                            </Col>
                                        </Row>
                                    </td>
                                    <td className='p-1'>
                                        <span>{`${hoursStr} ч. ${minutesStr} мин.`}</span>
                                    </td>
                                </tr>
                            )
                        })
                        }
                    </tbody>
                </Table>
                <InputGroup>
                    <InputGroup.Text>Всего колличество часов:</InputGroup.Text>
                    <InputGroup.Text>{Math.round(TimeHelper.toHoures(itemsSumTotal))}</InputGroup.Text>
                    <InputGroup.Text>{`(${hoursStr} ч. ${minutesStr} мин.)`}</InputGroup.Text>
                    <InputGroup.Text>{`(в часах: ${TimeHelper.toHoures(itemsSumTotal).toFixed(2)})`}</InputGroup.Text>
                </InputGroup>
            </CustomModal>
        )
    }
}