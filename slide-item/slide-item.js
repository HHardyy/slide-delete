// components/slide-item/slide-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isNeedAddClassifyButton: {
      type: Boolean,
      value: false
    }
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
    _touchStart: function (e) {
      this.setData({
        touchStartPageX: e.changedTouches[0].pageX,
      })
    },
    /**
     * 手指触摸结束
     */
    _touchEnd: function (e) {
      let touchEndPageX = e.changedTouches[0].pageX,
        offSetStartToEnd = touchEndPageX - this.data.touchStartPageX;
      if (offSetStartToEnd < 10 & offSetStartToEnd > -10) {
        return;
      };
      if (offSetStartToEnd > 10) {
        if(this.data.scrollLeft === 0) return;
        this.setData({
          scrollLeft: 0,
        });
      };
      if (offSetStartToEnd < -10) {
        this.setData({
          scrollLeft: this.data.isNeedAddClassifyButton ? 120 : 60,
        })
      }
    },
    /**
     * 点击删除按钮
     */
    _deleteTouchEnd: function(e) {
      let touchEndPageX = e.changedTouches[0].pageX,
        offSetStartToEnd = touchEndPageX - this.data.touchStartPageX;
      if (offSetStartToEnd < 10 & offSetStartToEnd > -10) {
        this.triggerEvent('delete', {});
      };
      return;
    },
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
    },
  }
})