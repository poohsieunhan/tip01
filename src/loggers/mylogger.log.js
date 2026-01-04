'use strict'

const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const { v4: uuidv4 } = require('uuid');

class MyLogger {
    constructor() {
        const formatPrint = format.printf(({ 
            level, message, context, requestId, timestamp, metadata
        }) => {
            const metaStr = metadata && Object.keys(metadata).length ? JSON.stringify(metadata) : '';
            return `${timestamp} :: ${level.toUpperCase()} :: ${context || 'N/A'} :: ${requestId || 'N/A'} :: ${message} ${metaStr}`;
        });

        this.logger = createLogger({
            format: format.combine(
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'context', 'requestId'] }),
                formatPrint
            ),
            transports: [
                new transports.Console(),
                new transports.DailyRotateFile({
                    dirname: 'src/logs',
                    filename: 'application-%DATE%.info.log',
                    datePattern: 'YYYY-MM-DD', // Changed from mm to DD to rotate daily, not every minute
                    zippedArchive: true,
                    maxSize: '20m', // 1m is very small and will rotate frequently
                    maxFiles: '14d',
                    level: 'info'
                }),
                new transports.DailyRotateFile({
                    dirname: 'src/logs',
                    filename: 'application-%DATE%.error.log',
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d',
                    level: 'error'
                })
            ]
        });
    }

    commonParams(params) {
        let context, req, metadata;
        if (!Array.isArray(params)) {
            context = params;
        } else {
            [context, req, metadata] = params;
        }
        const requestId = req?.requestId || uuidv4();
        return {
            context,
            requestId,
            metadata: metadata || {}
        };
    }

    log(message, params) {
        const { context, requestId, metadata } = this.commonParams(params);
        this.logger.info(message, { context, requestId, metadata });
    }

    error(message, params) {
        const { context, requestId, metadata } = this.commonParams(params);
        this.logger.error(message, { context, requestId, metadata });
    }
}

module.exports = new MyLogger();