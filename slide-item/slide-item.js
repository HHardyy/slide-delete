// components/slide-item/slide-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    touchStartPageX: 0,
    scrollLeft: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
   * 手指触摸开始
   */
    touchStart: function (e) {
      this.setData({
        touchStartPageX: e.changedTouches[0].pageX,
      })
    },
    /**
     * 手指触摸结束
     */
    touchEnd: function (e) {
      let touchEndPageX = e.changedTouches[0].pageX,
        // 获取滑动的距离，正代表右滑，负代表左滑
        offSetStartToEnd = touchEndPageX - this.data.touchStartPageX;
      // 滑动距离小于10px则不生效
      if (offSetStartToEnd < 10 && offSetStartToEnd > -10) {
        return;
      };
      if (offSetStartToEnd > 10) {
        if (this.data.scrollLeft === 0) {
          return;
        }
        this.setData({
          scrollLeft: 0,
        });
      };
      if (offSetStartToEnd < -10) {
        this.setData({
          scrollLeft: 100, // 当滑动未到底时，通过设置scrollLeft为你需要显示的按钮的宽度，来让其自动到达底部
        })
      }
    }
  }
})
