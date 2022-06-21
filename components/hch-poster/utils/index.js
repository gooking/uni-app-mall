/*
 * @Description: 公共方法
 * @Version: 1.0.0
 * @Autor: hch
 * @Date: 2021-07-22 00:01:09
 */
/**
 * @description: 绘制正方形（可以定义圆角），并且有图片地址的话填充图片
 * @param {CanvasContext} ctx canvas上下文
 * @param {number} x 圆角矩形选区的左上角 x坐标
 * @param {number} y 圆角矩形选区的左上角 y坐标
 * @param {number} w 圆角矩形选区的宽度
 * @param {number} h 圆角矩形选区的高度
 * @param {number} r 圆角的半径
 * @param {String} url 图片的url地址
 */
export function drawSquarePic(ctx, x, y, w, h, r, url) {
  ctx.save()
  ctx.beginPath()
  // 绘制左上角圆弧
  ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)
  // 绘制border-top
  // 画一条线 x终点、y终点
  ctx.lineTo(x + w - r, y)
  // 绘制右上角圆弧
  ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)
  // 绘制border-right
  ctx.lineTo(x + w, y + h - r)
  // 绘制右下角圆弧
  ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)
  // 绘制左下角圆弧
  ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)
  // 绘制border-left
  ctx.lineTo(x, y + r)
  // 填充颜色(需要可以自行修改)
  ctx.setFillStyle('#ffffff')
  ctx.fill()
  // 剪切，剪切之后的绘画绘制剪切区域内进行，需要save与restore 这个很重要 不然没办法保存
  ctx.clip()

  // 绘制图片
  return new Promise((resolve, reject) => {
    if (url) {
      wx.getImageInfo({
        src: url,
        success(res) {
          ctx.drawImage(res.path, x, y, w, h)
          ctx.restore() //恢复之前被切割的canvas，否则切割之外的就没办法用
          ctx.draw(true)
          resolve()
        },
        fail(res) {
          console.log('fail -> res', res)
          uni.showToast({
            title: '图片下载异常',
            duration: 2000,
            icon: 'none'
          })
        }
      })
    } else {
      ctx.draw(true)
      resolve()
    }
  })
}

/**
 * @description: 获取设备信息
 * @param {type}
 * @return {type}
 * @author: hch
 */
export function getSystem() {
  let system = wx.getSystemInfoSync()
  let scale = system.windowWidth / 375 //按照苹果留 375*667比例 其他型号手机等比例缩放 显示
  return { w: system.windowWidth, h: system.windowHeight, scale: scale }
}

/**
 * @description: 绘制文本时文本的总体高度
 * @param {Object} ctx canvas上下文
 * @param {String} text 需要输入的文本
 * @param {Number} x X轴起始位置
 * @param {Number} y Y轴起始位置
 * @param {Number} maxWidth 单行最大宽度
 * @param {Number} fontSize 字体大小
 * @param {String} color 字体颜色
 * @param {Number} lineHeight 行高
 * @param {String} textAlign 字体对齐方式
 */
export function drawTextReturnH(
  ctx,
  text,
  x,
  y,
  maxWidth = 375,
  fontSize = 14,
  color = '#000',
  lineHeight = 30,
  textAlign = 'left'
) {
  if (textAlign) {
    ctx.setTextAlign(textAlign) //设置文本的水平对齐方式  ctx.setTextAlign这个可以兼容百度小程序 ，注意：ctx.textAlign百度小程序有问题
    switch (textAlign) {
      case 'center':
        x = getSystem().w / 2
        break

      case 'right':
        x = (getSystem().w - maxWidth) / 2 + maxWidth
        break

      default:
        // 左对齐
        x = (getSystem().w - maxWidth) / 2
        break
    }
  }
  let arrText = text.split('')
  let line = ''
  for (let n = 0; n < arrText.length; n++) {
    let testLine = line + arrText[n]
    ctx.font = fontSize + 'px sans-serif' //设置字体大小，注意：百度小程序 用ctx.setFontSize设置字体大小后，计算字体宽度会无效
    ctx.setFillStyle(color) //设置字体颜色
    let metrics = ctx.measureText(testLine) //measureText() 方法返回包含一个对象，该对象包含以像素计的指定字体宽度。
    let testWidth = metrics.width
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y)
      line = arrText[n]
      y += lineHeight
    } else {
      line = testLine
    }
  }
  ctx.fillText(line, x, y)
  ctx.draw(true) //本次绘制是否接着上一次绘制。即 reserve 参数为 false，则在本次调用绘制之前 native 层会先清空画布再继续绘制；若 reserve 参数为 true，则保留当前画布上的内容，本次调用 drawCanvas 绘制的内容覆盖在上面，默认 false。
  return y
}
