import dotenv from 'dotenv'

if (process.env.NODE_ENV !== 'production') dotenv.config()

export const PORT = process.env.PORT || 5000
export const CT_TAX_CATEGORY_ID = process.env.CT_TAX_CATEGORY_ID || ''
export const CT_HOST = process.env.COMMERCETOOLS_HOST || ''
export const CT_AUTH_URL = process.env.COMMERCETOOLS_AUTH_URL || ''
export const CT_CLIENT_ID = process.env.COMMERCETOOLS_CLIENT_ID || ''
export const CT_CLIENT_SECRET = process.env.COMMERCETOOLS_CLIENT_SECRET || ''
export const CT_PROJECT_KEY = process.env.COMMERCETOOLS_PROJECT_KEY || ''