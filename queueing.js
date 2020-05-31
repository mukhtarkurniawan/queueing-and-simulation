let sim = {
    queue: [],
    service: []
}

let finishedCustomer = []

for (let i = 0; i < 3; i++){
    sim.queue[i] = [] 
}

// for (let i = 0; i < 3; i++){
//     var randService = Math.floor(Math.random() * 100) + 5;
//     sim.service[i] = {
//         is_handled: false,
//         weight: randService,
//         temp: randService
//     }  
// }

sim.service = [{
    is_handled: true,
    weight: 80,
    temp: 80
},{
    is_handled: true,
    weight: 70,
    temp: 70
},{
    is_handled: true,
    weight: 40,
    temp: 40
}]

let simTime = 2000
let iter = 0
let temp = 0
let indexCustomer = 0
let customer = generateCustomer()

while (iter < simTime){
    // Put customers to queue
    if (customer.arriveTime == temp){
        let minQueueLength = {
            amount: 1000, // initialize 
            index: 0
        }

        for (let i = 0; i < sim.queue.length; i++) {
            if (minQueueLength.amount > sim.queue[i].length ){
                minQueueLength.amount = sim.queue[i].length
                minQueueLength.index = i
            } else if (minQueueLength.amount == sim.queue[i].length) {
                continue
            }
        }

        sim.queue[minQueueLength.index].push(customer)
        indexCustomer = customer.user + 1 
        customer = generateCustomer()
        customer.user = indexCustomer
        temp = 0
    }

    // Check service
    if (sim.queue.length == sim.service.length){
        for (let i = 0; i < sim.queue.length; i++){
            if (sim.queue[i].length && sim.service[i].is_handled){
                sim.service[i].customer = sim.queue[i][0]
                sim.service[i].is_handled = false

                sim.queue[i].shift()
            }

            for (let j = 0; j < sim.queue[i].length; j++){
                sim.queue[i][j].waitingTime++
            }

            if (!sim.service[i].is_handled){
                sim.service[i].temp--

                if (sim.service[i].temp == 0){
                    sim.service[i].customer.finishedAt = iter
                    sim.service[i].customer.finishedFromServer = i
                    sim.service[i].customer.respondTime = sim.service[i].customer.waitingTime + sim.service[i].weight
                    finishedCustomer.push(sim.service[i].customer)
                    sim.service[i].is_handled = true
                    sim.service[i].temp = sim.service[i].weight
                }
            }
        }
    } else {

    }

    iter++
    temp++
}

console.log('Last Queue Simulation = ', sim.queue);
console.log('Finished Customer = ', finishedCustomer);

// next user

function generateCustomer(){
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

function eventHandler(){

}