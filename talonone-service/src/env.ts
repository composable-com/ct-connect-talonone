import dotenv from 'dotenv'
dotenv.config()

export const PORT = process.env.PORT || 5000
export const CTP_TAX_CATEGORY_ID = process.env.CTP_TAX_CATEGORY_ID || ''
