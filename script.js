// 获取canvas元素
const canvas = document.querySelector('canvas');

// 设置canvas元素的宽高，为浏览器视口的宽高
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//使用2D的绘图方式
const ctx = canvas.getContext('2d')  //getContext获取绘图环境

//定义花瓣的数量
let SAKURA_SUM = 60;
//定义花瓣数组
const sakuraArray = [];   //存放花瓣对象

// 花瓣类
class Sakura {
    //构造方法，用来初始化
    constructor(){
        //随机生成花瓣的坐标 x，y
        this.x = Math.random() * canvas.width;  //Math.random随机生成0-1之间的小数
        this.y = (Math.random() * canvas.height * 2) - canvas.height;
        //随机生成宽高
        this.width = Math.random() * 15 + 25;
        this.height = Math.random() * 12 + 20;
        //随机透明度
        this.opacity = this.w / 50;
        //设置一个随机数，用于控制花瓣旋转
        this.rotate = Math.random();
        //速度初始化
        this.xSpeed = Math.random() * 2 + 1;
        this.ySpeed = Math.random() + 1.5;
        //旋转速度
        this.rotateSpeed = Math.random() * 0.02;
    }
    //绘制
    draw(){
        //当花瓣超过canvas画布边界后，重新设置花瓣的坐标、速度和转速
        if(this.x >canvas.width || this.y > canvas.height){
            this.x = -sakuraImg.width; //刚好藏住
            this.y = (Math.random() * canvas.height * 2) - canvas.height;
            this.rotate = Math.random();
            this.xSpeed = Math.random() * 2 + 0.5;
            this.ySpeed = Math.random() + 1;
            this.rotateSpeed = Math.random() * 0.02;
        }

        //设置下整个canvas的透明基数
        ctx.globalAlpha = this.opacity;
        ctx.drawImage(
            sakuraImg,
            this.x,
            this.y,
            this.width *(0.6 + (Math.abs(Math.cos(this.rotate)) / 3)),//设置图片的宽高，让人从视觉上看起来是旋转了一定的角度
            this.height * (0.8 + (Math.abs(Math.sin(this.rotate)) / 5)),
        )
    }
    animate() {
        this.x += this.xSpeed + mouseX * 5;
        this.y += this.ySpeed + mouseX * 2;
        this.rotate += this.rotateSpeed;
        //重新绘制
        this.draw();
    }
}

/**
 * 渲染函数
 */
function render(){
    //清除矩形坐标内画布的内容
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //重新绘制
    sakuraArray.forEach(sakura=>sakura.animate());
    //该方法会告诉浏览器重绘之前调用指定的函数
    //这样可以保证在浏览器的刷新频率下去更新动画
    window.requestAnimationFrame(render);
}

//加载花瓣图片
const sakuraImg = new Image();   //声明一个图片对象
sakuraImg.src = './image/sakura.png';
//监听樱花图片加载完毕的load事件
sakuraImg.addEventListener('load', () => {
    //加载完毕执行这个回调函数
    //等花瓣图片加载完毕，将数目为SAKURA_SUM的花瓣实例保存到数组中
    for(let i = 0;i < SAKURA_SUM;i++){
        sakuraArray.push(new Sakura())
    }
    render();
});

// 监听浏览器窗口大小变化，重新设置canvas的宽高
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

let mouseX = 0;
function touchHandler(e){
    //clientX:客户端区域的水平座标（与页面坐标不同）
    mouseX = (e.clientX || e.touches[0].clientX) / window.innerWidth;
    //根据鼠标在y轴上的偏移量，设置樱花雨下的大不大
    //计算樱花花瓣数量相对60个增加多少
    SAKURA_SUM_DELTA = Math.floor(((e.clientY || e.touches[0].clientY) / window.innerHeight)*120);
    //当前期望的花瓣数量SAKURA_SUM_DELTA+SAKURA_SUM与此时实际花瓣数量sakuraArray.length的差值ArraylenDelta
    ArraylenDelta=SAKURA_SUM_DELTA+SAKURA_SUM-sakuraArray.length
    if(ArraylenDelta>0){
        //期望雨下的更大
        for (let i = 0; i < ArraylenDelta; i++) {
            sakuraArray.push(new Sakura())
        }
    }else{
        //期望雨变小
        for (let i = 0; i < Math.abs(ArraylenDelta); i++) {
            item=sakuraArray.pop(new Sakura())
            delete item;
        }
    }
}

//监听鼠标移动事件
window.addEventListener('mousemove',touchHandler);
//监听触点在触屏上移动事件
window.addEventListener('touchmove',touchHandler);