import { MINUTES_IN_HOUR, MINUTES_SEPARATOR } from '@shared/consts';
import TimeHelper, { TimeFormat } from '@utils/helpers/timeHelper';
import React, { Component } from 'react';
import TextMask from 'react-text-mask';
import { createNumberMask, createAutoCorrectedDatePipe } from 'text-mask-addons'


interface IProps {
    timeStr?: string
    timeInMinutes?: number
    format: TimeFormat
    onChange?: (timeStr: string) => void
    onChangeInMinutes?: (timeInMinutes: number) => void
}

export default class TimeTextMask extends Component<IProps, {}> {
    constructor(props: IProps) {
        super(props)
    }

    setInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target

        this.props.onChange && this.props.onChange(value)
        this.props.onChangeInMinutes && this.props.onChangeInMinutes(TimeHelper.parseTimeString(value, this.props.format).totalInMinutes)
    }

    onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const key = event.key as ChangesTypes

        const CHANGES = {
            ArrowUp: +1,
            ArrowDown: -1
        }

        type ChangesTypes = 'ArrowUp' | 'ArrowDown'
        const changeDirection = CHANGES[key as ChangesTypes] || 0
        if (changeDirection === 0) {
            return;
        }

        event.preventDefault()

        const { format } = this.props
        const { selectionStart, value } = event.currentTarget
        const { totalInMinutes, hoursRaw } = TimeHelper.parseTimeString(value, format)
        const isChangingHours = (selectionStart ?? 0) <= hoursRaw.length || selectionStart === 0

        const changeFactor = isChangingHours ? MINUTES_IN_HOUR : 1
        const newTime = Math.max(0, totalInMinutes + changeDirection * changeFactor)

        this.props.onChange && this.props.onChange(TimeHelper.formatTimeToString(newTime, format))
        this.props.onChangeInMinutes && this.props.onChangeInMinutes(newTime)
    }

    reformatTime = (event: React.FocusEvent<HTMLInputElement, Element>) => {
        const { value } = event.target
        if (!value) {
            return
        }

        const { format } = this.props
        const { totalInMinutes } = TimeHelper.parseTimeString(value, format)

        this.props.onChange && this.props.onChange(TimeHelper.formatTimeToString(totalInMinutes, format))
        this.props.onChangeInMinutes && this.props.onChangeInMinutes(totalInMinutes)
    }

    render() {
        const { format, timeStr, timeInMinutes } = this.props
        const str = (typeof timeStr !== 'undefined')
            ? timeStr
            : (typeof timeInMinutes !== 'undefined')
                ? TimeHelper.formatTimeToString(timeInMinutes, format)
                : ' '

        return (
            <>
                {format === 'HHHHH:mm' &&
                    <TextMask
                        value={str}
                        style={{ width: '100px' }}
                        placeholder={"0:00"}
                        mask={createNumberMask({
                            includeThousandsSeparator: false,
                            prefix: "",
                            allowDecimal: true,
                            decimalSymbol: MINUTES_SEPARATOR,
                            requireDecimal: true
                        })}
                        onChange={this.setInput}
                        onKeyDown={this.onKeyDown}
                        onBlur={this.reformatTime}
                    />
                }
                {format === 'HH:mm' &&
                    <TextMask
                        value={str}
                        style={{ width: '100px' }}
                        placeholder={'HH:MM'}
                        pipe={createAutoCorrectedDatePipe('HH:MM')}
                        mask={[/\d/, /\d/, ':', /\d/, /\d/]}
                        showMask={false}
                        guide={false}
                        onChange={this.setInput}
                        onKeyDown={this.onKeyDown}
                        onBlur={this.reformatTime}
                    />
                }
            </>
        )
    }
}