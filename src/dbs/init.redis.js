'use strict'
const {RedisErrorResponse} = require('../core/error.response')
const redis = require('redis')
let client={},statusConnectRedis={
    CONNECT:'connect',
    END:'end',
    ERROR:'error',
    RECONNECT:'reconnect'
}

const REDIS_CONNECT_TIMEOUT=10000, REDIS_CONNECT_MESSAGE={
    code: -99,
    message:{
        vn:'redis loi roi',
        en:'redis error'
    }
}

const handleTimeoutError=()=>{
    connectionTimeout = setTimeout(()=>{
        throw new RedisErrorResponse({
            message: REDIS_CONNECT_MESSAGE.message.vn,
            statusCode: REDIS_CONNECT_MESSAGE.code
        })
    },REDIS_CONNECT_TIMEOUT)
}

const handleEventConnection=({
    connectionRedis
})=>{
    connectionRedis.on(statusConnectRedis.CONNECT,()=>{
        console.log(`connectionRedis-Connection status: connected`)
        clearTimeout(connectionTimeout)
    })
    connectionRedis.on(statusConnectRedis.END,()=>{
        console.log(`connectionRedis-Connection status: disconected`)
        handleTimeoutError()
    })
    connectionRedis.on(statusConnectRedis.RECONNECT,()=>{
        console.log(`connectionRedis-Connection status: reconneting`)
        clearTimeout(connectionTimeout)
    })
    connectionRedis.on(statusConnectRedis.ERROR,(err)=>{
        console.log(`connectionRedis-Connection status: error: ${err}`)
        handleTimeoutError()
    })
}

const initRedis=()=>{
    const instanceRedis = redis.createClient()
    client.instanceRedis = instanceRedis
    handleEventConnection({
        connectionRedis: instanceRedis
    })
}

const getRedis=()=>{
    client
}

const closeRedis=()=>{

}

module.exports={
    initRedis,
    getRedis,
    closeRedis
}