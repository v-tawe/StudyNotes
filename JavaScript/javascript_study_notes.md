# JavaScript 笔记

## JavaScript 布局

- 通常 JavaScript 代码可以放到 `<head> </head>` 中；

    ```javascript
    <html>
        <head>
            <script type="text/javascript">
                alert('Hello World');
            </script>
        </head>
        <body>
            ...
        </body>
    </html>
    ```

    > `type` 默认属性即为：`JavaScript`, 所以可以不必显示指定。

- 将 JavaScript 代码放到单独的 `.js` 文件中；

    ```javascript
    <html>
        <head>
            <script src="/static/js/abc.js"></script>
        </head>
        <body>
            ...
        </body>
    </html>
    ```

## JavaScript 基础

### 比较运算符

`==` ： 自动转换数据类型在比较；
`===` ： 如果数据类型不一致，返回 `false`；

### 字符串

使用 \`xxxxxxx\` 标识多行字符串：

```javascript
console.log(`Hello
World
!`);
```

可以用 `{$variable}` 替换字符串中的变量：

```javascript
var name = 'Bob';
var age = 20;
console.log(`Hello, ${name}, you are ${age} years old!`);
```

对字符串的操作本身不会改变自身，而是返回一个新的字符串；

`str.toUpperCase()` - 转变为大写
`str.toLowerCase()` - 转变为小写
`str.indexOf('string')` - 获取指定字符串出现的位置
`str.substring(startIndex, length)` - 获取截取的字符串

### 数组

通过索引进行赋值可以直接修改这个 Array：

```javascript
var arr = ['A', 'B', 'C'];
arr[1] = 100;
arr; //arr now is ['A', 100, 'C'];
```

`indexOf(value)` - 搜索指定值的索引；
`slice(startIndex, length)` - 类似于 String 的 `substring()`；
`push('value1', 'value2')` - 末尾添加值；
`pop()` - 删除最有一个值；
`sort()` - 排序；
`reverse()` - 反转数组；
`splice(startIndex, deleteNum, replaceValue1, replaceValue2)` - 从指定的索引开始删除若干值，然后再从该位置添加若干值；
`concat(newArray)` - 连接两个 Array;
`join(connectValue)` - 每个值用指定的字符串连接，返回一个连接后的字符串

### 对象

JavaScript 对象是动态类型，可以添加或删除属性;

```javascript
var person = {
    name: 'David',
    age: '20',
};

person.gender = 'male'; // 新增 gender 属性
delete person.age; // 删除 age 属性
```

使用 `in`/`hasOwnProperty()` 检测是否拥有某属性：

`in` - 包括继承的属性, 例如： `toString` 是 `object` 对象的属性，结果也是 `true`;
`hasOwnProperty()` - 必须是自身拥有的属性

```javascript
'age' in person; //true
'birth' in person; //false
person.hasOwnProperty('age'); //true
person.hasOwnProperty('toString'); //true
```

### 循环

- `for(i=index; i<length; i++)`;
- `for (var key in object)`;
- `while(condition)`;
- `do {...} while(condition)`;

### Map & Set

`Map` - 键值对集合；

```javascript
var m = new Map([['David', 100], ['Bob', 10]]);
m.get('David'); //100
m.set('Adam', 99); //添加新的 key-value
m.has('Bob'); //true
m.delete('Adam') //删除 key-'Adam'
```

`Set` - Key 的集合，Key 不能重复，没有索引；

```javascript
var s = new Set([1, 2, 3, 3, '3']);
s.add(4); // Set {1, 2, 3, '3', 4}
s.delete(3); // Set {1, 2, '3', 4}
```

### iterable

新的 `iterable` 类型，`Array`、`Map` 和 `Set` 都属于 `iterable` 类型。

`for ... of` 循环 解决 `for ... in` 循环的历史遗留问题:

```javascript
var a = ['A', 'B', 'C'];
a.name = 'David';
for (var i in a) {
    console.log(i); // '0', '1', '2', 'name'
}
for (var i of a) {
    console.log(i); // 'A', 'B', 'C'
}

a.forEach(function (element, index, array) {
    // element: 指向当前元素的值；
    // index：指向当前索引；
    // array：指向 Array 对象本身
})
```

## 函数

2 种定义方法：

- `function abs(x) { ... }`
- `var abs = function(x) { ... };`

参数：

- `arguments` - 用于函数内部，指向传入的所有参数
- `...rest` - 指向传入的未显示指定的参数 `function foo(a, b, ...rest){ ... }`

### 作用域

JavaScript 默认有一个全局对象 `window`，任何全局变量（函数也视为变量）都会绑定到 `window` 上。

`var` - 定义**局部**作用域变量
`let` - 定于**块**级作用域变量

```javascript
function foo() {
    for (let i=0; i<100; i++) {
        //
    }
    i += 100; // SyntaxError;

    for (var i=0; i<100; i++) {
        //
    }
    i += 100; // 仍然可以引用变量i
}
```

`const` - 常量

### 解构赋值

可以同时赋值多个变量，包括嵌套的数组：

`let [x, [y, z]] = ['hello', ['hi', 'welcome']];`

对象赋值：

```javascript
var person = {
    name: 'David',
    age: 20,
    gender: 'male',
    passport: 'G-12345678',
    address: {
        city: 'Beijing',
        zipcode: '100001'
    }
};
var {name, address: {city, zip}} = person;
name; // 'David'
city; // 'Beijing'
zip; // undefined, 因为属性名是zipcode而不是zip
// 注意: address不是变量，而是为了让city和zip获得嵌套的address对象的属性:
address; // Uncaught ReferenceError: address is not defined
```

## 高阶函数

可以将函数作为参数传入：

```javascript
function add(x, y, abs) {
    return abs(x) + abs(y);
}
```

### map 方法

`arr.map(function (x) { return abs(x); } )` - 依次对数组的每个元素调用指定的函数：

```javascript
function pow(x) {
    return x * x;
}
var arr = [1, 2, 3, 4, 5];
arr.map(pow); // [2, 4, 9, 16, 25]

arr.map(function (x) { return x * x; }); // [2, 4, 9, 16, 25]

arr.map(x => x * x); // [2, 4, 9, 16, 25]
```

### reduce 方法

`arr.reduce(function (x, y) { return add(x, y); })` - 分别对数组的进行函数调用，依次往后累计：

```javascript
var arr = [1, 2, 3, 4, 5];
arr.reduce( function (x, y) { return x + y; }); // 15

arr.reduce( (x,y) => x * y; ) // 15
```

### filter 方法

`arr.filter(function (x) { return x>99 })` - 通过返回值决定是否保留该元素

### sort 方法

`arr.sort()` - 默认排序按字符串 ASCII 码进行排序（eg. 10 < 2）

`arr.sort(function(x,y) { if (x < y) return -1; else if (x > y) return 1; else return 0;})` - 修改排序规则则可以按照数字大小进行排序

`sort` 方法直接对当前 Array 进行修改。

### every 方法

判断 Array 中的每个元素是否满足条件

`let r = arr.every(funciton (s) { return s.length > 0;});` - 判断 Array 中是否存在空元素

### find\findIndex 方法

查找 Array 中满足条件的第一个元素\索引

`let s = arr.find(function (s) { return s.toLowerCase() === s });` - 返回第一个小写的元素，如果未找到返回 `undefinded`

### foreach 方法

用于遍历 Array, 没有返回值，也不会改变原 Array, 常用于遍历

`arr.forEach(console.log)`

## 闭包

将函数作为结果返回。实现一个计数器的示例：

```javascript
function counter (initial) {
    var x = initial || 0;
    return function() return x ++;
}

var c = conter(100);
c(); //100
c(); //101
```

## 箭头函数

```javascript
(x, y) => x * y;
```

==> 等价于 ==>

```javascript
function (x, y) {
    return x * y;
}
```

## generator 生成器

类似于在一个函数内可以返回多个结果

```javascript
function* name(max) {
    var index = 0;
    while(index < max) {
        yield index++;
    }
    return index;
}

for (var x of name()) {
    console.log(x);
}
```

## 标准对象

`number`, `string`, `boolean`, `function`, `underfined`, `object` - (`Array`, `null` 均属于 `object`）

### Date

`var date = new Date(2019, 6, 12);` - 2019/07/12

JavaScript 的 Date 对象月份值从 0 开始，牢记 0=1 月，1=2 月，2=3 月，……，11=12 月。

### RegExp

#### 正则表达式基础

`\d` - 数字
`\w` - 字母或数字
`\s` - 空格

`.` - 任意字符
`*` - 任意个字符(包括 0 个)
`+` - 至少一个字符
`?` - 0 或 1 个字符
`{n}` - n 个字符
`{n, m}` - n~m 个字符

`[]` - 表示范围
`[0-9a-zA-Z]` - 数字及字母
`A|B` - A 或 B
`^` - 以...开头
`$` - 以...结尾

`()` - 定义组

#### RegExp

`test()` 方法测试字符串是否符合正则表达式

```javascript
var re = new RegExp('^\d{3}\-\d{3-8}$');
var re = /^\d{3}\-\d{3-8}$/;

re.test('010-12345'); // true
```

`exec()` 方法提取正则表达式中定义的组, 失败返回 null

```javascript
var re = /^(\d{3})-(\d{3,8})$/;
re.exec('010-12345'); // ['010-12345', '010', '12345']
re.exec('010 12345'); // null
```

```javascript
var re = /^[0-9a-zA-Z\.]+@.+\.\w+$/; // 匹配邮箱 v-tawe@microsoft.com

var re = /^\<(.+)\>\s+([0-9a-zA-Z\.]+@.+\.\w+)$/; // 匹配带名字的邮箱 <David Tang> v-tawe@microsoft.com
```

#### JSON

序列化 - `JSON.parse('json')`
反序列化 - `JSON.stringify(obj)`

## 面向对象

两种创建对象的方式：

通过数据类型对象创建：

```javascript
var Student = {
    name: 'Robot';
    height: 1.2;
    run: function() {
        return this.name + 'is running';
    }
}

function createStudent(name) {
    var s = Object.create(Student);
    s.name = name;
    return s;
}

var xiaoming = createStudent('xiaoming');
xiaoming.run(); //xiaoming is runing
```

通过构造函数实现：

```javascript
function Student(props) {
    this.name = props.name || 'Robot';
    this.height  = props.height || '1.2';
}

Student.prototype.run = function() {
    return this.name + 'is running';
}

function createStudent(props) {
    return new Student(props || {})
}
```

通过 class 实现：

```javascript
class Student {
    constructor(name) {
        this.name = name;
    }

    run() {
        return this.name + 'is running';
    }
}
```

### 原型继承

定义新的构造函数，并在内部调用继承的构造函数的 `call()` 方法绑定`this`;

![inherits](./inherits.png)

只有函数才有 `prototype` 属性, `_proto_` 是所有对象都有的（包括函数）, 即对象原型 `xxx.constructor`。

通过构造函数实现继承：

```javascript
function inherits(Child, Father) {
    var F = function(){};
    F.prototype = Father.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
}

function Student(props) {
    this.name = props.name || 'unnamed';
    this.height = props.height || 1.2;
}

Student.prototype.run = function() {
    return this.name + 'is running';
}

function PrimaryStudent(props) {
    Student.call(this, props);
    this.grade = props.grade || 1;
}

inherits(PrimaryStudent, Student);

PrimaryStudent.prototype.getGrade = function() {
    return this.grade;
}
```

通过 class 实现继承：

```javascript
class PrimaryStudent extends Student {
    constructor(props) {
        super(props);
        this.grade = props.grade || 1;
    }

    getGrade() {
        return this.grade;
    }
}
```

## 浏览器

需要支持 ES6

- 浏览器窗口： `windows`： `windows.innerWidth; windows.innerHeight`;
- 浏览器信息： `navigator`: `navigator.appName; navigator.appVersion`...;
- 屏幕信息： `screen`: `screen.width; screen.height`...;
- 当前页面 URL 信息: `location`: `location.protocol; location.host`...;
- DOM 对象: `document`: `document.title; document.cookie`...;
    - `document.getElementById();` - 根据 ID 获取 DOM 节点
    - `document.getElementsByTagName();` - 根据 Tag 名词获取 DOM 节点
    - `document.cookie` - 获取 cookie 信息，服务器端使用 `httpOnly` 可以禁止 JS 读取 Cookie;
- 浏览器历史： `history`: `history.back(); history.forward();` **历史遗留对象已弃用！！**

### DOM

```javascript

var d = document.getElementById('id');
document.getElementsByTagName('p');
document.getElementsByClassName('class');

document.querySelector('#id');
document.querySelectorAll('div.class > p');

d.children; // 获取 id 下的所有子节点
d.firstElementChild; // 获取 id 下的第一个子节点

// 更新 DOM
d.innerHTML = 'ABC <span style="color:red">RED</span> XYZ'; // 可以设置 HTML 标签
d.innerText = 'ABC XYZ';

//// 设置 CSS
d.style.color = '#ff0000';
d.style.fontSize = '20px';

// 插入 DOM
var div1 = document.createElement('p');
div1.id = 'div1';
div1.innerText = 'DIV1';
d.appendChild(div1);

var ref = document.getElementById('ref');
d.insertBefore(div1, ref);

// 删除 DOM
var parent = d.parentElement;
// 删除节点时 children 节点实时变化
parent.removeChild(parent.children[0]); // 删除节点 0
parent.removeChild(parent.children[0]); // 删除节点 1
```

### 表单

没有 `name` 属性的表单控件不会提交。

表单控件

- `<input type='text'></input>`
- `<input type='password'></input>`
- `<input type='radio'></input>`
- `<input type='checkbox'></input>`
- `<input type='hidden'></input>`
- `<select></select></input>`

获取值

- `text, password, hidden, select` 使用 `value` 获取值
- `select` 使用 `checked` 获取值

### 文件

`<input type='file'></input>`

### AJAX

只支持同源策略访问，跨域需要使用 CORS 策略。

1. 创建 `XMLHttpRequest` 对象；
1. 设置 `onreadystatechange` 回调函数；
1. 通过 `readyState === 4` 判断请求是否完成；
1. 根据 `status === 2000` 判断是否成功响应；
1. 调用 `open()` 方法, 参数1： `GET/POST`; 参数2： URL 地址； 参数3：是否异步（默认 true);
1. 调用 `send()` 方法发送请求；

```javascript
var request = new XMLHttpRequest(); // 新建 AJAX 对象

// 状态发生变化时，函数被回调
request.onreadystatechange = function() {
    if (request.readyState === 4) { // 成功
        // 判断响应结果
        if (request.status === 200) {
            // 成功，responseText - 响应文本
            return success(request.responseText);
        }
        else {
            // 失败
            return fail(request.status);
        }
    }
}

// 发送请求
request.open('GET', '/api/categories');
request.send();
```

## Promise

```javascript
function ajax(method, url, data) {
    var request = new XMLHttpRequest();
    return new Promise(function (resolve, reject) {
        request.onreadystatechange = function() {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    resolve(request.responseText);
                }
                else {
                    reject(request.status);
                }
            }
        };
    request.open(method, url);
    request.send(data);
    });
}

var p = ajax('GET', '/api/categories');
p.then(function(text) {
    log.innerText = text;
}).catch(function(status) {
    log.innerText ='ERROR' + status;
})
```

并行执行： `Promise.all()`
容错执行： `Promise.race()`

```javascript
var p1 = new Promise(function(resolve, reject) {
    ...
})

var p2 = new Promise(function(resolve, reject) {
    ...
})

// p1, p2 均执行成功后，执行 then
Promise.all([p1, p2]).then(function(results) {
    console.log(results);
})

// p1, p2 同时执行，先执行成功的返回结果给 then，后执行成功的结果丢失
Promise.race([p1, p2]).then(function(result) {
    console.log(result);
})
```

## JQuery

- 按 ID 查找： `$('#id')`
- 按 class 查找： `$('.class')`
- 按 Tag 查找： `$('tag')`
- 按属性查找： `$('[name=email]')`; `$('[type=password]')`
    - `$('[name^=icon])`: 查找 name 属性以 icon 开头的 DOM;
    - `$('[name$=with]')`: 查找 name 属性以 with 结尾的 DOM;
- 组合查找： `$('input[name=email]')`; `$('tr.red')`
- 多项选择器： `$('p, div')`; `$('p.red, p.green')`; `$('input[name=email],[name=password]')`

### 选择器

- 层级选择器 用 空格 隔开： `$('ul li.class')`
- 子选择器 用 > 隔开： `$('ul > li.class')`

    层级选择器 和 子选择器的区别在： 子选择器必须时父子关系，不可跨层级选择！

- 过滤器 用 : 隔开： `$('ul li:first-child')`;  `$('ul li:last-child')`; `$('ul li:nth-child(2)')`; `$('ul li:nth-child(even)')`

### 表单相关

- `:input` - `<input>`, `<textarea>`, `<select>`, `<button>`
- `:file` - `input[type=file]`
- `:checkbox` - `input[type=checkbox]`
- `:radio` - `input[type=radio]`
- `:focus` - 获取鼠标当前的焦点控件 `input:focus`
- `:checked` - 已选择的单选或复选框控件 `input[type=radio]:checked`
- `:enabled` - 可以正常输入的控件
- `:disabled` - 已被禁用的控件
- `:visible` - 可见的控件
- `:hidden` - 隐藏的控件
- ... ...

### 查找 & 过滤

- `find()` - 在所有子节点中进行查找
- `parent()` - 从当前节点向上查找
- `next()` & `prev()` - 同一层级节点前后进行查找

- `filter()` - 过滤掉不符合条件的节点
- `map()` - 把一个 jQuery 对象包含的若干 DOM 节点转化为其他对象
- `first()` & `last()` & `slice(2, 4)` - 截取 jQuery 对象

### 操作

- `text()` & `html()` - 获取或修改 text 或 html
- `val()` - 获取或修改 value 属性
- `css()` - 获取或修改 css
- `hide()` & `show()` - 隐藏或显示元素; 增加参数可以实现淡入淡出效果： `hide('slow')` / `show('slow')`
- `attr()` & `removeAttr()` - 修改 DOM 属性
- `prop()` - 与 attr() 类似

- `append()` & `prepend()` - 添加 DOM 节点
- `before()` & `after()` - 在当前元素前/后插入 DOM 节点
- `remove()` - 删除节点

### 事件

绑定事件：

- `$('#id').on('click', function() { alert('Hello, World'); });`
- `$('#id').click(function() { alert('Hello, World'); });`

事件类型：

- `click` - 单击
- `dblclick` - 双击
- `mouseenter` - 鼠标移入
- `mouseleave` - 鼠标移除
- `mousemove` - 鼠标在 DOM 内移动
- `hover` - `mouseenter` + `mouseleave`

- `keydown` - 键盘按下
- `keyup` - 键盘松开
- `keypress` - 按一次键触发

- `focus` - DOM 获得焦点
- `blur` - DOM 失去焦点
- `change` - DOM 内容变更
- `submit` - form 提交
- `ready` - 页面载入并且 DOM 树初始化后 仅作用于 document 对象

    `$(document).ready(function() {...});` 
    简化后：
    `$(function() {...});`

- `off('click', <functionName>)` 取消事件绑定

### 动画效果

- `show('slow') / hide('slow') / toogle('slow')` - 左上角缓慢收缩
- `slideUp('slow') / SlideDown('slow') / slideToogle('slow')` - 垂直缓慢收缩
- `fadeIn('slow') / fadeOut('slow') / fadeToggle('slow')` - 淡入淡出
- `animate()` - 自定义效果

    ```javascript
    $('#id').animate({
        opacity: 0.25,
        width: 0px;
        height: 0px;
    }, 1000, function() { console.log('Complete'); }).delay(1000).animate(...);
    ```

    可以使用 `delay()` 实现动画的暂停。

### AJAX

- `$.ajax(async, method, contentType, data, headers, dataType)`
- `$.ajax(async, method, contentType, data, headers, dataType, jsonp:'callback', jsonpCallback:'callbackFunction', success: function(data){...})`

- `$.get(url)`
- `$.post(url, data)`

- `$.getJSON(url)`

### 扩展

1. 使用 `$.fn` 绑定函数
1. 使用 `return this` 实现链式调用
1. 插件有默认值，绑定在 `$.fn.<pluginName>.defaults` 上
1. 用户在调用时可传入参数以覆盖默认值

```javascript
$.fn.<pluginName> = function(options) {
    var bgcolor = options && options.bgcolor || '#FFFFFF';
    this.css('background', bgcolor)
    return this;
}
```

`extend(target, obj1, obj2, ...)` 会将靠后对象的值合并到第一个 target 中, 越往后面的对象优先级越高；

`extend({}, $.fn.<pluginName>.defaults, options)`

## 异常处理

使用 `try {...} catch {...} finally {...}` 捕获

> 注意：异步操作时的异常无法在调用处捕获，同样，对于控件的事件处理，在绑定事件的代码处无法捕获事件处理函数的异常。

## unerscore

与 jQuery 类似，提供一套完善的 API, 绑定到 `_` 变量上。

### Collections

#### map/filter

类似于 Array 的 `map/filter` 方法

- `_.map(object, function(value, key) {...});`
- `_.mapObject(object, function(value, key) {...});`
- `_.filter(object, function(value, key) {...});`

#### every/some

集合中元素都满足情况，`_.every()` 返回 `true`, 集合中部分元素满足情况， `_.some()` 返回 `true`

- `_.every([1, 4, 7, -3, -9], (x) => x > 0); // false`
- `_.some([1, 4, 7, -3, -9], (x) => x > 0); // true`

#### max/min

集合时 Object，会忽略掉 key，只比较 value

`_.max({ a: 1, b: 2, c: 3 }); // 3`

#### groupBy

`_.groupBy([1, 2, 3, 4, 5], (x) => { if(x<3) return 'small'; else return 'big' });`

更多 [underscrore 方法](https://underscorejs.org/)。