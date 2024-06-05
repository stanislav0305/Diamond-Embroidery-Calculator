import HTMLDecodeHelper from "@utils/helpers/htmlDecodeHelper"

export const currencyNames = ['ruble', 'euro', 'dollar'] as const
export type CurrencyNameType = typeof currencyNames[number]

export const CurrencyNameHtmlCodesMap: Map<CurrencyNameType, string> = new Map<CurrencyNameType, string>([
    ['ruble', HTMLDecodeHelper.decodeHTML('&#8381;')],
    ['euro', HTMLDecodeHelper.decodeHTML('&#8364;')],
    ['dollar', HTMLDecodeHelper.decodeHTML('&#36;')]
])