/**
 * 解析歌词字符串
 * 得到一个歌词对象的数组
 * 每个对象：
 * {time：开始时间，words：歌词内容}
 */
function paresLrc()
{
    var lines = lrc.split('\n');
    var result = [];//歌词对象数组
    for(var i = 0; i < lines.length; ++i)
    {
        var str = lines[i];
        var parts = str.split(']');
        var timeStr = parts[0].substring(1);
        var obj = {
            time: parseTime(timeStr),
            words:parts[1],
        };
        result.push(obj);
    }
    return result;
}
/**
 * 解析时间字符串
 * 转为时间数字
 */
function parseTime(timeStr)
{
    var parts = timeStr.split(':');
    return  +parts[0] * 60 + +parts[1];
}

var lrcData = paresLrc();

//获取需要的dom
var doms = {
    audio: document.querySelector('audio'),
    ul: document.querySelector('.container ul'),
    container: document.querySelector('.container'),
};
/**
 * 计算出当前播放器播放到第几秒的情况下
 * lrdData数组中，应该高亮显示的歌词下标
 * 如果刚开始没有歌词显示则是-1
 */
function findIndex()
{
    var curTime = doms.audio.currentTime;//播放器当前播放时间
    for(var i = 0; i < lrcData.length; ++i)
    {
        if(curTime < lrcData[i].time)
        {
            return i - 1;
        }
    }
    //找遍了都没有找到说明是最后一句
    return lrcData.length - 1;
}

/**
 * 创建歌词元素 li
 */
//界面
function createLrcElements()
{
    //创建文档片段
    var frag = document.createDocumentFragment();
    for(var i = 0; i < lrcData.length; ++i)
    {
        var li = document.createElement('li');
        li.textContent = lrcData[i].words;
        frag.appendChild(li);//改动了DOM树
    }
    doms.ul.appendChild(frag);
}

createLrcElements();

//容器高度
var containerHeight = doms.container.clientHeight;
//li高度
var liHeight = doms.ul.children[0].clientHeight;
//最大偏移量
var maxOffset = doms.ul.clientHeight - containerHeight;

/**
 * 设置ul元素的偏移量
 */
function setOffest()
{
    var index = findIndex();
    var offset = liHeight * index + liHeight / 2 - containerHeight / 2;
    if(offset < 0)
        offset = 0;
    if(offset > maxOffset)
        offset = maxOffset;
    doms.ul.style.transform = `translateY(-${offset}px)`;
    //去掉之前的active样式
    var li = doms.ul.querySelector('.active');
    if(li)
    {
        li.classList.remove('active');
    }
    li = doms.ul.children[index];
    if(li)
        doms.ul.children[index].classList.add('active');
}

doms.audio.addEventListener('timeupdate',setOffest);
setOffest();