import LogHelper from './utils/helpers/logMainHelper'
import AppHelper from './utils/helpers/appHelper'


LogHelper.init()
console.info('-------------------------------------------------------')
console.info('Log from the main process')
console.info(`process.env.NODE_ENV = '${process.env.NODE_ENV}'`)

AppHelper.init()