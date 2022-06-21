<!--
 * @Description: 生成海报组件
 * @Version: 1.0.0
 * @Autor: hch
 * @Date: 2020-08-07 14:48:41
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-07-30 09:25:07
 * 保存海报按钮和关闭按钮 在html代码中写出来 绑定点击方法然后透明 再用canvas 覆盖
-->

<template>
  <view class="content">
    <view class="btn" @tap="handleDraw('square1')">正方形</view>
    <view class="btn" @tap="handleDraw('square2')">圆角方形</view>
    <view class="btn" @tap="handleDraw('square3')">圆形</view>
    <view class="btn" @tap="handleDraw('pic1')">图片</view>
    <view class="btn" @tap="handleDraw('text1')">左对齐文本</view>
    <view class="btn" @tap="handleDraw('text2')">居中对齐文本</view>
    <view class="btn" @tap="handleDraw('text3')">右对齐文本</view>

    <view
      class="canvas-content"
      v-show="canvasShow"
      :style="'width:' + system.w + 'px; height:' + system.h + 'px;'"
    >
      <!-- 遮罩层 -->
      <view class="canvas-mask"></view>
      <!-- :width="system.w" :height="system.h" 支付宝必须要这样设置宽高才有效果 -->
      <canvas
        class="canvas"
        :canvas-id="canvasId"
        :id="canvasId"
        :style="'width:' + system.w + 'px; height:' + system.h + 'px;'"
        :width="system.w"
        :height="system.h"
      ></canvas>
      <view class="button-wrapper">
        <!-- 保存海报按钮 -->
        <!-- #ifndef MP-QQ -->
        <!-- cover-view 标签qq小程序有问题 -->
        <cover-view class="save-btn cancel-btn" @tap="handleCancel">取消</cover-view>
        <!-- #endif -->
        <!-- #ifdef MP-QQ -->
        <view class="save-btn cancel-btn" @tap="handleCancel">取消</view>
        <!-- #endif -->
      </view>
    </view>
  </view>
</template>

<script>
  import { drawSquarePic, drawTextReturnH, getSystem } from './utils'
  export default {
    data() {
      return {
        canvasId: 'canvas',
        system: {},
        canvasShow: false,
        square1: {
          //正方形
          x: 40,
          y: 40,
          r: 0, //圆角半径
          w: 80, //宽度
          h: 80 //高度
        },
        square2: {
          //圆角方形
          x: 40,
          y: 40,
          r: 10, //圆角半径
          w: 80, //宽度
          h: 80 //高度
        },
        square3: {
          //圆形
          x: 40,
          y: 40,
          r: 40, //圆角半径
          w: 80, //宽度
          h: 80 //高度
        },
        pic1: {
          x: 40,
          y: 40,
          url: 'https://huangchunhongzz.gitee.io/imgs/poster/product.png',
          r: 0, //圆角半径
          w: 250, //宽度
          h: 200 //高度
        },
        text1: {
          x: 0,
          y: 40,
          text: '今日上新水果，牛奶草莓',
          fontSize: 16, //字体大小
          color: '#000', //颜色
          lineHeight: 25, //行高
          mt: 0 //margin-top
        },
        text2: {
          x: 0,
          y: 40,
          text: '今日上新水果，牛奶草莓',
          fontSize: 16, //字体大小
          color: 'blue', //颜色
          lineHeight: 25, //行高
          mt: 0, //margin-top
          align: 'center' //对齐方式
        },
        text3: {
          x: 0,
          y: 40,
          text: '今日上新水果，牛奶草莓',
          fontSize: 16, //字体大小
          color: 'red', //颜色
          lineHeight: 25, //行高
          mt: 0, //margin-top
          align: 'right' //对齐方式
        }
      }
    },
    created() {
      // 获取设备信息
      this.system = getSystem()
    },
    methods: {
      /**
       * @description: 展示海报
       * @param {type}
       * @return {type}
       * @author: hch
       */
      handleDraw(type) {
        console.log('handleDraw -> type', type)
        this.canvasShow = true
        this.draw(type)
      },
      /**
       * @description: 绘制
       * @author: hch
       */
      draw(type) {
        uni.showLoading({
          title: '绘制中...'
        })
        if (this.ctx) {
          this.ctx.clearRect(0, 0, this.system.w, this.system.h) //清空之前的海报
          this.ctx.restore() //恢复之前被切割的canvas，否则切割之外的就没办法用
        } else {
          this.ctx = uni.createCanvasContext(this.canvasId, this)
        }
        let drawData = this[type]
        if (type === 'square1' || type === 'square2' || type === 'square3' || type === 'pic1') {
          // 绘制图像/图片
          drawSquarePic(
            this.ctx,
            drawData.x,
            drawData.y,
            drawData.w,
            drawData.h,
            drawData.r,
            drawData.url
          )
        } else {
          // 绘制文本
          let textY = drawTextReturnH(
            this.ctx,
            drawData.text,
            drawData.x,
            drawData.y,
            this.system.w,
            drawData.fontSize,
            drawData.color,
            drawData.lineHeight,
            drawData.align
          )
        }

        uni.hideLoading()
      },
      /**
       * @description: 取消海报
       * @param {type}
       * @return {type}
       * @author: hch
       */
      handleCancel() {
        this.canvasShow = false
      }
    }
  }
</script>

<style lang="scss">
  .content {
    margin-bottom: 80rpx;
    overflow: hidden;
    border-bottom: 1rpx solid $uni-border-color;

    .btn {
      float: left;
      width: 30%;
      margin: 10rpx;
      font-size: 30rpx;
      line-height: 72rpx;
      color: #fff;
      text-align: center;
      background: $uni-btn-color;
      border-radius: 45rpx;
      border-radius: 36rpx;
    }
  }

  .canvas-content {
    position: absolute;
    top: 0;
    z-index: 9;

    .canvas-mask {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 9;
      width: 100%;
      height: 100%;
      background: $uni-btn-color;
    }

    .canvas {
      z-index: 10;
    }

    .button-wrapper {
      position: fixed;
      bottom: 20rpx;
      z-index: 16;
      display: flex;
      width: 100%;
      height: 72rpx;
      justify-content: space-around;
    }

    .save-btn {
      z-index: 16;
      width: 40%;
      height: 100%;
      font-size: 30rpx;
      line-height: 72rpx;
      color: #fff;
      text-align: center;
      background: $uni-btn-color;
      border-radius: 45rpx;
      border-radius: 36rpx;
    }

    .cancel-btn {
      color: $uni-btn-color;
      background: #fff;
    }

    .canvas-close-btn {
      position: fixed;
      top: 30rpx;
      right: 0;
      z-index: 12;
      width: 60rpx;
      height: 60rpx;
      padding: 20rpx;
    }
  }
</style>
