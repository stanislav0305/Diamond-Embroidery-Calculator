import React from 'react'
import { Alert } from 'react-bootstrap'


interface PropsI {
    pricePerHourDefault: number
    pricePerHour: number
}

export default function PricePerHourAutoCorrectAlert(props: PropsI) {
    const { pricePerHourDefault, pricePerHour } = props

    return (
        <>
            {(pricePerHour >= pricePerHourDefault) &&
                <Alert variant="success" className="p-1">
                    <small className="text-muted small">
                        <i className="bi me-1 bi-info-circle"></i>
                        Цена за час (за работу) была перерасчитана (Цена за час = {pricePerHour.toFixed(2)}).&nbsp;
                        {(pricePerHour > pricePerHourDefault) &&
                            <>И она больше цены за час по умолчанию (больше {pricePerHourDefault.toFixed(2)}).</>
                        }
                        {(pricePerHour === pricePerHourDefault) &&
                            <>И она равна цене за час по умолчанию (равна {pricePerHourDefault.toFixed(2)}).</>
                        }
                    </small>
                </Alert>
            }
            {((pricePerHour > 0) && (pricePerHour < pricePerHourDefault)) &&
                <Alert variant="warning" className="p-1">
                    <small className="text-muted small">
                        <i className="bi me-1 bi-exclamation-triangle"></i>
                        Цена за час (за работу) была перерасчитана (Цена за час = {pricePerHour.toFixed(2)}).&nbsp;
                        И она меньше цены за час по умолчанию ({pricePerHourDefault.toFixed(2)}).
                    </small>
                </Alert>
            }
            {(pricePerHour <= 0) &&
                <Alert variant="danger" className="p-1">
                    <small className="text-muted small">
                        <i className="bi me-1 bi-exclamation-triangle"></i>
                        Цена за час (за работу) была перерасчитана (Цена за час = {pricePerHour.toFixed(2)}).&nbsp;
                        Цена картины слишком мала.
                    </small>
                </Alert>
            }
        </>
    )
}