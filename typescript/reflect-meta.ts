import 'reflect-metadata';
let target = {};
Reflect.defineMetadata('name','zhufeng',target);
Reflect.defineMetadata('name', 'world', target,'hello');
// console.log(Reflect.getOwnMetadata('name',target));
// console.log(Reflect.getOwnMetadata('name', target, 'hello'));
// console.dir(target);

function classMetadata(key,value){
     return function(target){
         Reflect.defineMetadata(key, value, target);
     }
}
function methodMetadata(key, value) {
    //target类的原型
    return function (target,propertyName) {
        //Person.prototype.hello.name=world
        Reflect.defineMetadata(key, value, target, propertyName);
    }
}
//decorator
//给类本身增加元数据
//@Reflect.metadata('name','Person')
@classMetadata('name', 'Person')
class Person{
    constructor(public name: string, public age: number) {}
    //给类的原型增加元数据
  //@Reflect.metadata('name', 'world')
   @methodMetadata('name', 'world')
   hello():boolean{ return true}
}
// console.log(Reflect.getMetadata('name', Person));
// console.log(Reflect.getMetadata('name', new Person(),'hello'));

const t1 = Reflect.getMetadata('design:paramtypes', Person)
const t2 = Reflect.getMetadata('design:returntype', Person.prototype, 'hello')
const t3 = Reflect.getMetadata('design:type', Person.prototype, 'hello')

console.log(t1);
console.log(t2());
console.log(t3());
