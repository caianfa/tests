const path = require('path')
var EventEmitter = require('events');

class Man extends EventEmitter {}

var man = new Man();

man.on('wakeup', function(){
    console.log('man has woken up');
});

man.on('wakeup', function(){
    console.log('man has woken up again');
});

man.emit('wakeup');

console.log(process.env.PATH);
console.log(process.env.PATH.split(path.delimiter));