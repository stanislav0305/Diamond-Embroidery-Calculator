import React, { useContext } from 'react'
import { CurrencyContext } from '@contexts/currency-context'


interface PropsI {
    bayFullPrice: number
    detailsSumTotal: number
    withLabel: boolean
}

export default function PictureProfit(props: PropsI) {
    const currencyContext = useContext(CurrencyContext)

    const { bayFullPrice, detailsSumTotal, withLabel } = props
    const profit = bayFullPrice - detailsSumTotal
    const textColor = profit > 0 ? 'text-success' : profit === 0 ? 'text-warning' : 'text-danger'

    return (
        <>
            {withLabel &&
                <label className={`fw-bold ${textColor}`}>Прибыль: </label>
            }
            <span className={`${textColor}`}>{profit.toFixed(2)}</span>
            <span className={`ms-1 ${textColor}`}>{currencyContext.currencyHtmlCode}</span>
        </>
    )
}