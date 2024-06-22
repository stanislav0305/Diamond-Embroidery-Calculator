import LogHelper from '@mainUtils/helpers/logMainHelper'
import { Application } from '@general/application'


LogHelper.init()
console.info('-------------------------------------------------------')
console.info('Log from the main process')
console.info(`process.env.NODE_ENV = '${process.env.NODE_ENV}'`)

const isProduction = process.env.NODE_ENV === 'production'

export const app = new Application(isProduction)