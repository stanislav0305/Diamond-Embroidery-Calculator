import React from 'react'
import { FieldHelperProps } from 'formik';
import { InputAttributes, NumericFormatProps } from 'react-number-format'
import NumericPositiveDecimal2 from '@components/inputs/numeric-positive-decimal2-format'
import IntPositive from '@components/inputs/int-positive-format'


export abstract class BaseFormat extends React.Component<Props, {}>{
}

export type Props = React.HTMLAttributes<HTMLInputElement> &
    NumericFormatProps<InputAttributes> &
{
    helpers?: FieldHelperProps<any>
    displayType?: 'input' | 'text'
}

export type InputTypes = typeof NumericPositiveDecimal2 | typeof IntPositive