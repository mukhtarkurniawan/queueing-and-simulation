let poolLength = 10
let pool = []
let q = []
let waitingSum = 0
let respondSum = 0
let serviceSum = 0
let queueLength = 0
let dropOut = []

for (var i = 0; i < poolLength; i++) {
  var randService = Math.floor(Math.random() * 100) + 5;
  var randArrive = Math.floor(Math.random() * 100) + 5;
  var temp = {
    user: i + 1,
    arriveTime: randArrive,
    waitingTime: 0,
    serviceTime: randService,
    respondTime: randService
  };
  pool.push(temp)
}

q.push(pool[0])
pool.shift()

while (q.length > 0 && q.length <= 8 && pool.length >= 0) {
  if (pool.length > 0) {
    console.log(q);
    queueLength += (q.length - 1) //every iteration, we will record the queue length

    if (q.length == 8) { // The next pool is going to be dropped
      dropOut.push(pool[0])
      pool.shift()

      waitingSum += q[0].waitingTime
      respondSum += q[0].waitingTime + q[0].serviceTime
      q.shift()
    } else {
      console.log('Next arrive Time : ' + pool[0].arriveTime);
      console.log('Difference : ' + (q[0].serviceTime - pool[0].arriveTime));
      if (q[0].serviceTime > pool[0].arriveTime) {
        q[0].serviceTime -= pool[0].arriveTime
        pool[0].arriveTime -= pool[0].arriveTime

        for (let i = 0; i < q.length; i++) {
          pool[0].waitingTime += q[i].serviceTime //every move, we will add up the waiting time in the queue
        }

        // pool[0].waitingTime = q[q.length - 1].waitingTime + q[q.length -1].serviceTime - pool[0].ar

        serviceSum += pool[0].serviceTime //serviceSum will be add up when pool[0] will come in so it can hold the service time
        q.push(pool[0])
        pool.shift()

      } else if (q[0].serviceTime < pool[0].arriveTime) {
        pool[0].arriveTime -= q[0].serviceTime
        q[0].serviceTime -= q[0].serviceTime

        if (q.length == 1) {
          serviceSum += pool[0].serviceTime
          q.push(pool[0])  //masuk server
          pool.shift()  
        }

        waitingSum += q[0].waitingTime                      // before q[0] comes out, we will record the waiting time
        respondSum += (q[0].waitingTime + q[0].respondTime)   // and respond time
        q.shift()
        
      } else if (q[0].serviceTime == pool[0].arriveTime) {
        pool[0].arriveTime -= q[0].serviceTime
        q[0].serviceTime -= q[0].serviceTime

        waitingSum += q[0].waitingTime
        respondSum += (q[0].waitingTime + q[0].respondTime)
        q.shift()

        for (let i = 0; i < q.length; i++) {
          pool[0].waitingTime += q[i].serviceTime //every move, we will add up the waiting time in the queue
        }

        serviceSum += pool[0].serviceTime
        q.push(pool[0])
        pool.shift()
      }
    }
  } else {
    waitingSum += q[0].waitingTime
    respondSum += (q[0].waitingTime + q[0].respondTime)

    q.shift()
  }
}

var waitingRate = waitingSum / (poolLength - dropOut.length)
var respondRate = respondSum / (poolLength - dropOut.length)
var serviceRate = serviceSum / (100)
var queueLengthRate = queueLength / 100

console.log(queueLength);

console.log('==================');
console.log('waiting = ' + waitingRate.toFixed(2));
console.log('respond = ' + respondRate.toFixed(2));
console.log('service = ' + serviceRate.toFixed(2));
console.log('queueLength = ' + queueLengthRate.toFixed(2));
console.log('dropout = ' + dropOut.length);

console.log(q);