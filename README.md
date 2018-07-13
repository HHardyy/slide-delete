# 微信小程序：左拉删除
###背景
本身因为项目需求，需要实现列表左滑删除功能。因为懒，也觉得网上应该有现成的，就去百度了一波。确实有发现很不错的，例如这两篇文章：
https://segmentfault.com/a/1190000014831500
https://github.com/onlyling/some-demo/tree/master/sideslip-delete。
但是第一篇文章表示列表的高度需要固定，这就满足不了我的需求。而第二篇文章对其实现感觉太过繁琐，故自己想了如何简易地实现左滑删除。

###实现
我们通过使用微信小程序提供的scroll-view标签来实现左右滑动，我不知道为什么我看到的所有网上的教程都没有人用scroll-view标签，一开始我以为是用该标签无法实现，但是自己做了才发现用scroll-view标签实现会比只用view标签实现方便很多。

因为是左右滑动，所以我们需要使得scroll-view标签属性`scorll-x="true"`，在看scroll-view标签时，发现了两个有意思的属性`scroll-left`和`scroll-with-animation`，这两个属性就是帮助我们简便快捷地实现左滑删除的必要属性。

因为小程序没有自带的swipe滑动，所以我们需要自己计算左滑还是右滑。这里我们采用touchstart和touchend方法，通过获取pageX的位置来判断是左滑还是右滑。说到这，微信小程序提供的事件里还有touchmove方法，但是我尝试使用该方法发现根本触发不了，如果有知道的大神，望在下面评论里告知使用方法。

采用touchstart来捕捉，起始所在的位置。
```
 /**
   * 手指触摸开始
   */
    touchStart: function (e) {
      this.setData({
        touchStartPageX: e.changedTouches[0].pageX,
      })
    },
```
用touchend根据移动的距离来判断是左滑还是右滑，这里我对左右滑动小于10px的滑动不予生效。
```
/**
     * 手指触摸结束
     */
    touchEnd: function (e) {
      let touchEndPageX = e.changedTouches[0].pageX,
        offSetStartToEnd = touchEndPageX - this.data.touchStartPageX;  // 获取滑动的距离，正代表右滑，负代表左滑
      // 滑动距离小于10px则不生效
      if (offSetStartToEnd < 10 && offSetStartToEnd > -10) {
        return;
      };
      if (offSetStartToEnd > 10) {
        // 如果本身就已经是0，则不需要我们再调整位置
        if (this.data.scrollLeft === 0) {
          return;
        }
        this.setData({
          scrollLeft: 0,
        });
      };
      if (offSetStartToEnd < -10) {
        this.setData({
          scrollLeft: 100,  // 当滑动未到底时，通过设置scrollLeft最大，来让其自动到达底部
        })
      }
    }
```

###总结
使用事件touchstart和touchend时，使用bind不知道为什么会有回弹效果，如果有需要该效果的可以修改catch为bind，这样左滑就会有回弹效果。

该文章里对于为什么scroll-left能够实现左滑描述的有点不清不楚，实在是不知道该怎么直白简便地讲解出来，没看懂的同学可以看我放在github上的源码，源码不多一看便知。
地址: 
tips: 样式上的设置，因为每个人的需求肯定是不同的，如果大家在样式上有不同，可以直接自己修改。