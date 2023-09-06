import axios, { AxiosRequestHeaders } from 'axios'
import { isFuture } from 'date-fns'
import { CT_AUTH_URL, CT_CLIENT_ID, CT_CLIENT_SECRET, CT_HOST, CT_PROJECT_KEY } from 'env'
import { logger } from './utils/logger'

interface CommonHeaderProperties extends AxiosRequestHeaders {
  ExpiredAt: string
}

export const CT_CLIENT_CREDENTIALS = {
  CLIENT_ID: CT_CLIENT_ID,
  CLIENT_SECRET: CT_CLIENT_SECRET,
  PROJECT_KEY: CT_PROJECT_KEY
}

export const CT_BASE_URLS = {
  CT_HOST: CT_HOST,
  AUTH_URL: CT_AUTH_URL
}

const { CLIENT_ID, CLIENT_SECRET } = CT_CLIENT_CREDENTIALS
const { AUTH_URL } = CT_BASE_URLS

export const ctClient = axios.create()

const setDefaultHeader = (key: string, value: string) => {
  ctClient.defaults.headers.common[key] = value
}

const getAccessToken = async (clientId: string, clientSecret: string) => {
  const axiosInstance = axios.create()
  return axiosInstance
    .post(
      `${AUTH_URL}/oauth/token`,
      {},
      {
        params: {
          grant_type: 'client_credentials',
        },
        auth: {
          username: clientId,
          password: clientSecret,
        },
      }
    )
    .then((res) => res.data)
    .catch((err) => {
      logger.error('Error trying to get access token', err.message)
      throw err
    })
}

const addSeconds = (date: Date, seconds: number) => {
  return new Date(date.getTime() + seconds * 1000).getTime().toString()
}

let isLogged = false
export const ctLogin = async (forceLogin?: boolean) => {
  if (!isLogged || forceLogin) {
    const accessToken = await getAccessToken(CLIENT_ID, CLIENT_SECRET)
    setDefaultHeader(
      'Authorization',
      `${accessToken.token_type} ${accessToken.access_token}`
    )

    setDefaultHeader(
      'ExpiredAt',
      `${addSeconds(new Date(), accessToken.expires_in)}`
    )
    isLogged = true
  }
}

ctClient.interceptors.request.use(async (request) => {
  const commonHeaders = request.headers
    ?.common as unknown as CommonHeaderProperties
  const expiresAt = Number(commonHeaders?.['ExpiredAt'] ?? -1)
  if (expiresAt < 0) return request

  if (!isFuture(expiresAt)) {
    await ctLogin(true)
  }

  return request
})
