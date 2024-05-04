const { Mutex } = require('async-mutex');

// Mutex instances for different payment processes
const mutexes = {
    payment1: new Mutex(),
    payment2: new Mutex(),
    payment3: new Mutex()
};

const acquireLock = async (paymentProcess) => {
    const mutex = mutexes[paymentProcess];
    return await mutex.acquire();
};

const releaseLock = (lock, paymentProcess) => {
    const mutex = mutexes[paymentProcess];
    lock.release();
};

module.exports = { acquireLock, releaseLock };
