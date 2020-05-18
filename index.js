const cluster = require('cluster')
const os = require('os')
const express = require('express')
const isPrime = require('./is-prime')

if (cluster.isMaster) {
    console.log("********Inside Cluster Master Block*******")
    const cpuCount = os.cpus().length
    console.log("CPU Count" + cpuCount)
    for (let i = 0; i < cpuCount; i++) {
        cluster.fork()
    }
}
else {
    console.log("********Inside Cluster Worker Block*******")
    const app = express()

    app.get('/', (req, res) => {
        const primes = []
        const max = Number(req.query.max) || 1000
        for (let i = 1; i <= max; i++) {
            if (isPrime(i)) primes.push(i)
        }
        res.json(primes)
    })

    const port = process.env.PORT || 3030

    app.listen(port)

    console.log('app is running on port', port)
}

cluster.on('exit', (worker) => {
    console.log('Worker', worker.id, ' is no more!')
    cluster.fork()
})