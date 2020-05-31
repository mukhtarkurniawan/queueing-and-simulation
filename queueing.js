// Initialize Simulation, to hold queue and service in server
let sim = {
    queue: [],
    service: []
}

let finishedCustomer = []
let totalCustomerInQueue = []
let amountOfQueue = 3
let amountOfServer = 3

for (let i = 0; i < amountOfQueue; i++) {
    sim.queue[i] = []
    totalCustomerInQueue[i] = 0
}

// Generate service in server
for (let i = 0; i < 3; i++) {
    var randService = Math.floor(Math.random() * 100) + 50;
    sim.service[i] = {
        is_handled: true,
        weight: randService,
        temp: randService
    }
}

// sim.service = [{
//     is_handled: true,
//     weight: 80,
//     temp: 80
// },{
//     is_handled: true,
//     weight: 70,
//     temp: 70
// },{
//     is_handled: true,
//     weight: 40,
//     temp: 40
// }]

// Iteration is based on time
let simTime = 2000
let iter = 0
let nextArrival = 0
let indexCustomer = 0
let customer = generateCustomer()

while (iter < simTime) {

    // Put customers to queue
    if (customer.arriveTime == nextArrival) {
        // Initialize min Queue Length
        let minQueue = {
            length: 1000,
            index: 0
        }

        // Find the minimum length in queues, if the minimum is found
        // then the customer will be put in that queue
        for (let i = 0; i < sim.queue.length; i++) {
            if (minQueue.length > sim.queue[i].length) {
                minQueue.length = sim.queue[i].length
                minQueue.index = i
            } else if (minQueue.length == sim.queue[i].length) {
                continue
            }
        }

        sim.queue[minQueue.index].push(customer)
        indexCustomer = customer.user + 1

        // Generate New Customer after earlier customer enter the queue
        customer = generateCustomer()
        customer.user = indexCustomer
        nextArrival = 0
    }

    // Check Queue and Service

    // If amount of queue and server are same 
    // then queue and server are going to be parallel
    if (sim.queue.length == sim.service.length) {
        for (let i = 0; i < sim.queue.length; i++) {
            // If server empty then it will pick the customer from selected queue
            if (sim.queue[i].length && sim.service[i].is_handled) {
                sim.service[i].customer = sim.queue[i][0]
                sim.service[i].is_handled = false

                sim.queue[i].shift()
            }

            // Count the waitingTime each customer in queues
            for (let j = 0; j < sim.queue[i].length; j++) {
                sim.queue[i][j].waitingTime++
            }

            // If server finish the service, then server will push the customer to finished array
            if (!sim.service[i].is_handled) {
                sim.service[i].temp--

                if (sim.service[i].temp == 0) {
                    sim.service[i].customer.finishedAt = iter
                    sim.service[i].customer.finishedFromServer = i
                    sim.service[i].customer.respondTime = sim.service[i].customer.waitingTime + sim.service[i].weight

                    finishedCustomer.push(sim.service[i].customer)
                    sim.service[i].is_handled = true
                    sim.service[i].temp = sim.service[i].weight
                }
            }
        }

    }

    // If amount of queue and service are different 
    // then server will pick the earlier user in first line of queues
    else if (sim.queue.length != sim.service.length) {
        // Initialize earlier user
        let earlierUser = {
            user: 1000,
            queue: 0
        }

        let isValidUpdate = false // If there is no customer in every queues then we cannot update it

        // Find the earliest customer in queues
        for (let i = 0; i < sim.queue.length; i++) {
            if (sim.queue[i].length) {
                if (sim.queue[i][0].user < earlierUser.user) {
                    earlierUser.user = sim.queue[i][0].user
                    earlierUser.queue = i
                    isValidUpdate = true
                }
            }

            // Count the waitingTime each customer in queues
            for (let j = 0; j < sim.queue[i].length; j++) {
                sim.queue[i][j].waitingTime++
            }
        }

        if (isValidUpdate == true) {
            for (let i = 0; i < sim.service.length; i++) {
                // If server empty then it will pick the customer from selected queue
                if (sim.queue[earlierUser.queue].length && sim.service[i].is_handled) {
                    sim.service[i].customer = sim.queue[earlierUser.queue][0]
                    sim.service[i].is_handled = false

                    sim.queue[earlierUser.queue].shift()
                }

                // If server finish the service, then server will push the customer to finished array
                if (!sim.service[i].is_handled) {
                    sim.service[i].temp--

                    if (sim.service[i].temp == 0) {
                        sim.service[i].customer.finishedAt = iter
                        sim.service[i].customer.finishedFromServer = i
                        sim.service[i].customer.respondTime = sim.service[i].customer.waitingTime + sim.service[i].weight

                        finishedCustomer.push(sim.service[i].customer)
                        sim.service[i].is_handled = true
                        sim.service[i].temp = sim.service[i].weight
                    }
                }
            }
        }
    }

    for (let i = 0; i < sim.queue.length; i++) {
        totalCustomerInQueue[i] += sim.queue[i].length
    }

    iter++
    nextArrival++
}

let totalWaiting = 0

for (let i = 0; i < finishedCustomer.length; i++) {
    totalWaiting += finishedCustomer[i].waitingTime
}

console.log('Last Queue Simulation = ', sim.queue);
console.log('Finished Customer = ', finishedCustomer);
console.log('Average Waiting Time = ', (totalWaiting / finishedCustomer.length).toFixed(3))

for (let i = 0; i < totalCustomerInQueue.length; i++) {
    console.log('Average Amount Of Customer in queue ', i, (totalCustomerInQueue[i] / simTime).toFixed(3))
}


// Generate Customer 
function generateCustomer() {
    var randArrive = Math.floor(Math.random() * 30) + 5;

    let customer = {
        user: 0,
        arriveTime: randArrive,
        waitingTime: 0,
        respondTime: 0,
        finishedAt: 0,
        finishedFromServer: 0
    }

    return customer
}