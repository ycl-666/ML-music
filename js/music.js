

// 设置axios的基地址
axios.defaults.baseURL = 'https://autumnfish.cn';
// axios.defaults.baseURL = 'http://localhost:3000';

// 实例化vue
var app = new Vue({
    el: ".wrap",
    data: {
        //背景图片的切换
        bkgList: [
            // "background: url(../images/bkg/bkg1.jpg);",
            // "background: url(../images/bkg/bkg2.jpg);",
            // "background: url(../images/bkg/bkg3.jpg);",
            // "background: url(../images/bkg/bkg4.jpg);"
            "../images/bkg/bkg1.jpg",
            "../images/bkg/bkg2.jpg",
            "../images/bkg/bkg3.jpg",
            "../images/bkg/bkg4.jpg",
        ],
        bkgindex: 0,
        //当前时间
        currentTime: 0,
        //当前歌词所在行
        currentRow: 0,
        //
        lyricMove: {
            top: "0rem",
        },
        //定时器
        dsq: '',
        //播放结束定时器结束
        totalTime: 0,
        //背景地址
        bkgurl: '',
        // 搜索关键字
        query: '',
        // 歌曲列表
        musicList: [],
        // 歌曲url
        musicUrl: '',
        // 是否正在播放
        isPlay: false,
        // 歌曲热门评论
        hotComments: [],
        // 歌曲封面地址
        coverUrl: '',
        // 显示视频播放
        showVideo: false,
        // mv地址
        mvUrl: '',
        //歌词
        songWords: '初来乍到 请多关照',
        //歌词数组
        lyrics: []
    },
    watch: {
        currentTime() {
            // this.lyrics.forEach((element, index) => {
            //     this.isEnd = false;
            //     if (this.currentTime == element.time) {
            //         this.lyricMove.top = -index * 31.5 + 90 + "px";
            //         this.currentRow = index; //通过比较我们歌词属性里的时间与当前播放时间，来定位到该歌词

            //     }
            //     console.log(this.currentTime)
            //     // console.log(this.lyrics[this.lyrics.length - 1])
            // })
            try {
                this.lyrics.forEach((element, index) => {
                    if (this.currentTime == element.time) {
                        this.lyricMove.top = -index * 31.5 + 90 + "px";
                        this.currentRow = index; //通过比较我们歌词属性里的时间与当前播放时间，来定位到该歌词
                        throw new Error("End")
                    }
                })
            } catch (error) {
                if (error.message === "End")
                    console.log(this.currentTime);
            }
            if (this.currentTime > this.totalTime) {
                this.lyricMove.top = 90 + "px";
                this.currentRow = 0; //通过比较我们歌词属性里的时间与当前播放时间，来定位到该歌词
                this.currentTime = 0;
                clearInterval(this.dsq);
                this.dsq = setInterval(() => {
                    this.currentTime++;
                }, 1000);
            }
        }
    },
    // 方法
    // mounted() {

    // },
    methods: {
        // 搜索歌曲
        searchMusic() {
            if (this.query == 0) {
                return
            }
            axios.get('/search?keywords=' + this.query).then(response => {
                // 保存内容
                console.log(response);
                this.musicList = response.data.result.songs;

            })

            // 清空搜索
            this.query = ''
        },
        // 播放歌曲
        playMusic(musicId) {
            // 获取歌曲url
            axios.get('/song/url?id=' + musicId).then(response => {
                // 保存歌曲url地址
                this.musicUrl = response.data.data[0].url
            })
            // 获取歌曲热门评论
            axios.get('/comment/hot?type=0&id=' + musicId).then(response => {
                // console.log(response)
                // 保存热门评论
                this.hotComments = response.data.hotComments

            })
            // 获取歌曲封面
            axios.get('/song/detail?ids=' + musicId).then(response => {
                console.log(response)
                // 设置封面
                this.coverUrl = response.data.songs[0].al.picUrl
                this.totalTime = response.data.songs[0].dt / 1000
                console.log(this.totalTime)
            })

            axios.get('/lyric?id=' + musicId).then(response => {
                this.songWords = '该歌曲暂未收录歌词'
                console.log(response)
                this.songWords = response.data.lrc.lyric
                console.log(this.songWords)
                this.lyrics = [];
                this.formatLyric(this.songWords)
            }
            )

            this.currentTime = 0;
            clearInterval(this.dsq);
            this.dsq = setInterval(() => {
                this.currentTime++;

            }, 1000);
        },
        // audio的play事件
        play() {
            this.isPlay = true
            // 清空mv的信息
            this.mvUrl = ''
        },
        // audio的pause事件
        pause() {
            this.isPlay = false
        },
        // 播放mv
        playMv(vid) {
            if (vid) {
                this.showVideo = true;
                // 获取mv信息
                axios.get('/mv/url?id=' + vid).then(response => {
                    // console.log(response)
                    // 暂停歌曲播放
                    this.$refs.audio.pause()
                    // 获取mv地址
                    this.mvUrl = response.data.data.url
                })
            }
        },
        // 关闭mv界面
        closeMv() {
            this.showVideo = false
            this.$refs.video.pause()
        },
        // 搜索历史记录中的歌曲
        historySearch(history) {
            this.query = history
            this.searchMusic()
            this.showHistory = false;
        },
        //背景图片切换
        changebkg() {
            if (this.bkgindex == this.bkgList.length - 1)
                this.bkgindex = 0
            else
                this.bkgindex++
            // console.log(this.bkgindex)
            // this.bkgurl = "background: url(" + this.bkgList[this.bkgindex] + ");"
            this.bkgurl = this.bkgList[this.bkgindex]
            // console.log(this.bkgurl)
            // var dd = document.getElementById("bkg666").style.background = " url(" + this.bkgurl + ") no-repeat";
            document.getElementsByClassName("wrap")[0].style.background = " url(" + this.bkgurl + ")no-repeat left top/ cover ";
            // document.getElementsByClassName("wrap")[0].style.background-size="100% 100%";
        },
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
    },


})
