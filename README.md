# 项目开发文档
new branch
## 项目名
```
墨灵Music
```
## 工具
```
VsCode uTools 云主机
```
## 框架 
```
Vue前端框架 
```
## 项目示例
<img src="http://molingfile.cn.utools.club//mlMusic/whole1.png"  />

## 项目描述

### 开发目的
```
### 主要原因本人比较喜欢听音乐
    最开始用酷狗，觉得不方便，一是使用起来本身就不太方便程序启动慢，而是由于版权等原因很多Music都下架了，一些音乐还要VIP才能听，再者对于自己喜欢的音乐，下载几乎也是难上加难得事了，总结来说，酷狗就是干啥啥不行，啥都得要VIP。
    后来就在网络发现了墨灵音乐，一款在线音乐播放器，可以随便听歌，随便下载，都不要钱的，很棒！后来很久一段时间没听音乐了，一天兴趣来了想听音乐，偶然的发现墨灵竟然服务器关闭了。很难受！但我也发现一个有趣的事情：墨灵的创作者竟然是一大二学生，对于服务器的关闭他表示伤心和遗憾，毕竟服务器的成本过高，一个大二学生难以承担，再者墨灵使用人数逐渐增多，一些人就开始恶意攻击服务器，为此创作者烦恼不已。所以创作者后来无耐之下关闭了服务器。
    后来自己就干脆写个得了，嗯
### 次要原因
    个人爱好，喜欢的东西就要整一个！
```
### 开发历程
```
2021-04-01至2021-04-07
    html5、css3学习，学习各种标签及样式、选择器，标签布局，动画等等，完成了背景图模块，音乐播放器主体构建，各种动画效果。
2021-04-08至2021-04-16
    js、vue学习，vue的属性绑定，点击事件，axios网络请求等等，学起来有点费时间，完成了背景切换，歌单搜索,歌单及热评，mv标签隐藏和显示问题显示。
2021-04-17
    数据解析整理，vue watch监听，标签属性内联，定时器等等，实现了歌词动态美化效果。
```
### 页面布局
```
    想了很久，觉得还是怎么方便怎么来，我有服务器，项目整好了挂上，自己听，我还做个登录注册页面？要啥自行车？
```
#### 大体布局


```
    1·切换背景
```
<img src="http://molingfile.cn.utools.club//mlMusic/bkg.png"  />

```
    2·歌词板块
```
<img src="http://molingfile.cn.utools.club/mlMusic/songwords.png"  />

```
    3·音乐播放器主体部分
```
<img src="http://molingfile.cn.utools.club/mlMusic/music.png"  />

```
    4·MV播放模块
```
<img src="http://molingfile.cn.utools.club/mlMusic/mv.png"  />

### 疑难问题
#### css,jsd导入顺序问题
```
    后面的css样式会替换前面的css样式。
    被依赖的js要放前面，例如Jquery的js需要放到前面，bootstrap的js会依赖它。
    js提前加载放在head里,延迟加载defer,异步加载async
```

#### 歌词解析
```
formatLyric(songWords) {
            let arr = songWords.split("\n"); //原歌词文本已经换好行了方便很多，我们直接通过换行符“\n”进行切割
            let row = arr.length; //获取歌词行数
            for (var i = 0; i < row; i++) {
                let temp_row = arr[i]; //现在每一行格式大概就是这样"[00:04.302][02:10.00]hello world";
                let temp_arr = temp_row.split("]");//我们可以通过“]”对时间和文本进行分离
                let songWords = temp_arr.pop(); //把歌词文本从数组中剔除出来，获取到歌词文本了！
                //再对剩下的歌词时间进行处理
                temp_arr.forEach(element => {
                    let obj = {};
                    let time_arr = element.substr(1, element.length - 1).split(":");//先把多余的“[”去掉，再分离出分、秒
                    let s = parseInt(time_arr[0]) * 60 + Math.ceil(time_arr[1]); //把时间转换成与currentTime相同的类型，方便待会实现滚动效果
                    obj.time = s;
                    obj.songWords = songWords;
                    this.lyrics.push(obj); //每一行歌词对象存到组件的lyric歌词属性里
                });
            }
            this.lyrics.sort(this.sortRule); //由于不同时间的相同歌词我们给排到一起了，所以这里要以时间顺序重新排列一下
            // this.$store.commit("setLyric", this.lyric); //把歌词提交到store里，为了重新进入该组件时还能再次渲染
            console.log(this.lyrics[0])
        },
        sortRule(a, b) { //设置一下排序规则
            return a.time - b.time;
        }
```
#### 定时器
```
clearInterval(this.dsq);
            this.dsq = setInterval(() => {
                this.currentTime++;

            }, 1000);
```
#### 监听
```
watch: {
        currentTime() {
            this.lyrics.forEach((element, index) => {
                this.isEnd = false;
                if (this.currentTime == element.time) {
                    this.lyricMove.top = -index * 31.5 + 90 + "px";
                    this.currentRow = index; //通过比较我们歌词属性里的时间与当前播放时间，来定位到该歌词
                    return
                }
                console.log(this.currentTime)
            })
            if (this.currentTime >= this.lyrics[this.lyrics.length - 1]) {
                this.isEnd = true;
            }
            if (this.isEnd == true) {
                this.lyricMove.top = 90 + "px";
                this.currentRow = 0; //通过比较我们歌词属性里的时间与当前播放时间，来定位到该歌词
                this.lyrics = [];
                this.currentTime = 0;
                clearInterval(this.dsq);
            }
        }
    }
```
## 总结
```
    值得被吐槽的地方很多，当然，菜鸟的我只能做到这水平了。如果有机会，肯定会用上最新的技术来写。
    每个部分实现起来并不复杂，甚至对于很多大佬来说，too easy 甚至 too low 了。然鹅，完整的跑起来并让它持续地跑是一件相当有挑战的事情。一个人顾及方方面面，确实不易。
    维护起来因为平时就很忙所以断断续续的。维护的不连续性也产生了很多麻烦。
    现在回看，我觉得最糟糕的是：很多东西没有深入理解或者学习，就用上了。比如 ：SSL 原理不懂，就给部署上了。JS、CSS 没系统学，边写边抄是大忌。
```