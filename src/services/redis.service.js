'use strict'

const redis = require('redis')
//const redisClient = redis.createClient()
const { revervationInventory } = require('../models/repositories/inventory.repo')

// Connect to redis (Required for v4+)
// redisClient.connect().catch(console.error);

const {getRedis}= require('../dbs/init.redis.js')
const {
    intanceConnect: redisClient
} = getRedis()



const aquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v2023_${productId}`
    const retryTimes = 10
    const expireTime = 3000 // 3s

    // FIXED: Changed retryTimes.length to retryTimes
    for (let i = 0; i < retryTimes; i++) {
        // In Redis v4, setNX returns a boolean
        // We use the modern 'set' command with arguments for atomicity
        const result = await redisClient.set(key, 'lock', {
            NX: true,
            PX: expireTime
        })

        if (result === 'OK') {
            const isReservation = await revervationInventory({ productId, cartId, quantity })
            if (isReservation.modifiedCount) {
                return key
            }
            // If reservation fails, release the lock immediately and return null
            await redisClient.del(key)
            return null
        } else {
            // Wait 50ms before retrying
            await new Promise((resolve) => setTimeout(resolve, 50))
        }
    }
}

const releaseLock = async (keyLock) => {
    return await redisClient.del(keyLock)
}

module.exports = {
    aquireLock,
    releaseLock
}