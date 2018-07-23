### 背景
本身因为项目需求，需要实现列表左滑删除功能。因为懒，也觉得网上应该有现成的，就去百度了一波。确实有发现很不错的，例如这两篇文章：
https://segmentfault.com/a/1190000014831500
https://github.com/onlyling/some-demo/tree/master/sideslip-delete。
但是第一篇文章表示列表的高度需要固定，这就满足不了我的需求。而第二篇文章对其实现感觉太过繁琐，故自己想了如何简易地实现左滑删除。

### 实现
我们通过使用微信小程序提供的scroll-view标签来实现左右滑动，我不知道为什么我看到的所有网上的教程都没有人用scroll-view标签，一开始我以为是用该标签无法实现，但是自己做了才发现用scroll-view标签实现会比只用view标签实现方便很多。

因为是左右滑动，所以我们需要使得scroll-view标签属性`scorll-x="true"`，在看scroll-view标签时，发现了两个有意思的属性`scroll-left`和`scroll-with-animation`，这两个属性就是帮助我们简便快捷地实现左滑删除的必要属性。

>scroll-left 即指定滚动条位置

>scoll-with-animation 即允许滚动时以动画的形式过渡，什么意思呢？在我理解就是给元素一个animation动画效果，但是这个效果不是你设置的，而是微信自己内部生成的，具体是不是用animation实现我也不知道。。。

因此我们只需要根据左滑还是右滑设置滚动条距离左边的位置再配合动画的效果，就可以轻松实现左滑删除效果。

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
### 补充：按钮点击事件的实现(7/23)
一开始我以为点击事件这一块并不需要我写，但是我发现是我太年轻了。实现按钮点击，我们需要注意的是：微信小程序事件的执行顺序是(touchstart > touchend > tap)，所以因为我们之前使用了catch阻止了事件冒泡，这里如果我们在点击事件的实现上采用tap事件，并不会生效。这里我们需要一个折中的办法，使用touchend判断是点击还是滑动。
这里我们给按钮一个touchend，通过判断移动的大小，这里我们将移动小于10px的认为是点击事件。故此，一个按钮点击就已经实现了。
```
<view class="item-classify" wx:if="{{isNeedAddClassifyButton}}" bind:touchend="_setTouchEnd">
  <view class='iconfont icon-shanchu' style='font-size:20px;'></view>
  <text style='font-size: 12px;'>分类设置</text>
</view>
/**
 * 点击设置按钮
 */
_setTouchEnd: function (e) {
  let touchEndPageX = e.changedTouches[0].pageX,
    offSetStartToEnd = touchEndPageX - this.data.touchStartPageX;
  if (offSetStartToEnd < 10 & offSetStartToEnd > -10) {
    this.triggerEvent('set', {});
  };
  return;
}
```
### 总结
使用事件touchstart和touchend时，使用bind不知道为什么会有回弹效果，如果有需要该效果的可以修改catch为bind，这样左滑就会有回弹效果。

该文章里对于为什么scroll-left能够实现左滑描述的有点不清不楚，实在是不知道该怎么直白简便地讲解出来，没看懂的同学可以看我放在github上的源码，源码不多一看便知。

地址:https://github.com/Codedogdogdog/slide-delete 

tips: 样式上的设置，因为每个人的需求肯定是不同的，如果大家在样式上有不同，可以直接自己修改。

接下来我会对该组件进行修改，为了小伙伴们在接下来使用中除了样式上的自己改动外，其它都不需要改动，可直接使用该组件。到时候将会在github上进行更新，如果感兴趣的话，在这跪求star(有点想要跳槽的想法，= =希望各位大佬给点帮助)。