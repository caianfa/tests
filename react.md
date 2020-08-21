尽管我们已经能够存取公用state，但store的变化并不会直接引起视图的更新，我们需要监听store的变化，这里我们应用一个设计模式——观察者模式，观察者模式被广泛运用于监听事件实现（有些地方写的是发布订阅模式，但我个人认为这里称为观察者模式更准确，有关观察者和发布订阅的区别，讨论有很多，读者可以搜一下）所谓观察者模式，概念也很简单：观察者监听被观察者的变化，被观察者发生改变时，通知所有的观察者。那么我们如何实现这种监听-通知的功能呢，为了照顾还不熟悉观察者模式实现的同学，我们先跳出redux，写一段简单的观察者模式实现代码：//观察者
class Observer {    
    constructor (fn) {      
        this.update = fn    
    }
}
//被观察者
class Subject {    
    constructor() {        
        this.observers = []          //观察者队列    
    }    
    addObserver(observer) {          
        this.observers.push(observer)//往观察者队列添加观察者    
    }    
    notify() {                       //通知所有观察者,实际上是把观察者的update()都执行了一遍       
        this.observers.forEach(observer => {        
            observer.update()            //依次取出观察者,并执行观察者的update方法        
        })    
    }
}
var subject = new Subject()       //被观察者
const update = () => {console.log('被观察者发出通知')}  //收到广播时要执行的方法
var ob1 = new Observer(update)    //观察者1
var ob2 = new Observer(update)    //观察者2
subject.addObserver(ob1)          //观察者1订阅subject的通知
subject.addObserver(ob2)          //观察者2订阅subject的通知
subject.notify()                  //发出广播,执行所有观察者的update方法复制代码解释一下上面的代码：观察者对象有一个update方法(收到通知后要执行的方法)，我们想要在被观察者发出通知后，执行该方法；被观察者拥有addObserver和notify方法，addObserver用于收集观察者，其实就是将观察者们的update方法加入一个队列，而当notify被执行的时候，就从队列中取出所有观察者的update方法并执行，这样就实现了通知的功能。我们redux的监听-通知功能也将按照这种实现思路来实现subscribe：有了上面观察者模式的例子，subscribe的实现应该很好理解，这里把dispatch和notify做了合并，我们每次dispatch，都进行广播，通知组件store的状态发生了变更。import { reducer } from './reducer'
export const createStore = (reducer) => {        
    let currentState = {}        
    let observers = []             //观察者队列        
    function getState() {                
        return currentState        
    }        
    function dispatch(action) {                
        currentState = reducer(currentState, action)                
        observers.forEach(fn => fn())        
    }        
    function subscribe(fn) {                
        observers.push(fn)        
    }        
    dispatch({ type: '@@REDUX_INIT' })  //初始化store数据        
    return { getState, subscribe, dispatch }
}复制代码我们来试一下这个subscribe（这里就不创建组件再引入store再subscribe了，直接在store.js中模拟一下两个组件使用subscribe订阅store变化）：import { reducer } from './reducer'
export const createStore = (reducer) => {        
    let currentState = {}        
    let observers = []             //观察者队列        
    function getState() {                
        return currentState        
    }        
    function dispatch(action) {                
        currentState = reducer(currentState, action)                
        observers.forEach(fn => fn())        
    }        
    function subscribe(fn) {                
        observers.push(fn)        
    }            
    dispatch({ type: '@@REDUX_INIT' })  //初始化store数据        
    return { getState, subscribe, dispatch }
}

const store = createStore(reducer)       //创建store
store.subscribe(() => { console.log('组件1收到store的通知') })
store.subscribe(() => { console.log('组件2收到store的通知') })
store.dispatch({ type: 'plus' })         //执行dispatch，触发store的通知复制代码控制台成功输出store.subscribe()传入的回调的执行结果：

作者：写代码像蔡徐抻
链接：https://juejin.im/post/5def4831e51d45584b585000
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。