import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import path from 'path';
import * as winston from 'winston';
const winstonDaily = require('winston-daily-rotate-file');
const moment = require('moment-timezone');

const isProduction = process.env['NODE_ENV'] === 'production';
const logDir = path.join(__dirname, '../../logs');
const appendTimestamp = winston.format((info, opts) => {
  if (opts.tz)
    info.timestamp = moment().tz(opts.tz).format(' YYYY-MM-DD HH:mm:ss ||');
  return info;
});

const dailyOptions = (level: string) => {
  return {
    level,
    datePattern: 'YYYY-MM-DD',
    dirname: logDir + `/${level}`,
    filename: `%DATE%.${level}.log`,
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
  };
};

export const winstonLogger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      level: isProduction ? 'info' : 'silly',
      format: isProduction
        ? winston.format.simple()
        : winston.format.combine(
            appendTimestamp({ tz: 'Asia/Seoul' }),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('TicketingApp', {
              colors: true,
              prettyPrint: true,
            }),
          ),
    }),
    new winstonDaily(dailyOptions('info')),
    new winstonDaily(dailyOptions('warn')),
    new winstonDaily(dailyOptions('error')),
  ],
});
