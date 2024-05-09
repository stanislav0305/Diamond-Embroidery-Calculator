import React from 'react'
import { NumericFormat } from 'react-number-format'
import { BaseFormat, Props } from '@components/inputs/types';


export default class NumericPositiveDecimal2Format extends BaseFormat {
  constructor(props: Props) {
    super(props)
  }

  render() {
    const { helpers, displayType, ...otherProps } = this.props

    return (
      <NumericFormat
        {...otherProps}
        displayType={displayType}

        thousandSeparator={false}
        decimalSeparator="."
        decimalScale={2}
        fixedDecimalScale={true}
        allowNegative={false}
        allowLeadingZeros={false}
        valueIsNumericString={true}
        onValueChange={(values) => {
          const { floatValue } = values;
          console.log(`onValueChange: ${floatValue ?? 0.00}`)
          helpers?.setValue(floatValue ?? 0.00)
        }}
      />
    )
  }
}

