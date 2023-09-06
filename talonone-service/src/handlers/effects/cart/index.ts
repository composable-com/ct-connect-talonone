import setDiscountHandler, { SetDiscountParams } from './setDiscount'

export interface EffectHandlers {
  [key: string]: (params: any) => any
}

export const getCartEffectHandlers = (
  currencyCode: string,
  taxCategoryId: string
): EffectHandlers => {
  return {
    setDiscount: (params: SetDiscountParams) =>
      setDiscountHandler(params, currencyCode, taxCategoryId)
    // add more effect handlers here
  }
}

export default getCartEffectHandlers
