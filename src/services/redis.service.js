'use strict'

const redis = require('redis')
const {promisify} = require('util')
const redisClient = redis.createClient()
const {revervationInventory} = require('../models/repositories/inventory.repo')

const pexpire = promisify(redisClient.pexpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setnx).bind(redisClient)

const aquireLock = async (productId, quantity,cartId) => {
    const key=`lock_v2023_${productId}`
    const retryTimes = 10
    const expireTime = 3000 //3s

    for(let i=0;i<retryTimes.length;i++){
        // tao 1 key, thang nao nam giu thi duoc vao thanh toan
        const result = await setnxAsync(key,expireTime)
        console.log('result',result)
        if(result===1){
            const isReservation = await revervationInventory({productId,cartId,quantity})
            if(isReservation.modifiedCount){
                await pexpire(key,expireTime)
                return key
            }
            return null;
        }else{
            await new Promise((resolve)=>setTimeout(resolve,50))
        }
    }
}

// xoa key di
const releaseLock = async (keyLock) => {
    const delAyncKey = promisify(redisClient.del).bind(redisClient)
    return await delAyncKey(keyLock)
}

module.exports = {
    aquireLock,
    releaseLock
}