// @ts-nocheck
declare var tt: Uni
declare var swan: Uni
declare var my: Uni
declare var dd: Uni
declare var ks: Uni
declare var jd: Uni
declare var qa: Uni
declare var qq: Uni
declare var qh: Uni
declare var qq: Uni

export function platform(): Uni | WechatMiniprogram.Wx {
	const UNDEFINED = 'undefined'
	if(typeof wx !== UNDEFINED) return wx // 微信
	if(typeof tt !== UNDEFINED) return tt // 字节 飞书
	if(typeof swan !== UNDEFINED) return swan // 百度
	if(typeof my !== UNDEFINED) return my // 支付宝
	if(typeof dd !== UNDEFINED) return dd // 钉钉
	if(typeof ks !== UNDEFINED) return ks // 快手
	if(typeof jd !== UNDEFINED) return jd // 京东
	if(typeof qa !== UNDEFINED) return qa // 快应用
	if(typeof qq !== UNDEFINED) return qq // qq
	if(typeof qh !== UNDEFINED) return qh // 360
	if(typeof uni !== UNDEFINED) return uni
	return null
}