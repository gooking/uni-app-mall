<template>
	<u-popup :show="value" mode="bottom" round="32rpx" :closeable="true"
	 :z-index="uZIndex" :closeOnClickOverlay="maskCloseAble" @close="close">
		<u-tabs v-if="value" :list="genTabsList" :current="tabsIndex" @change="tabsChange"></u-tabs>
		<view class="area-box">
			<view class="u-flex" :class="{ 'change':isChange }">
				<view class="area-item">
					<view class="u-padding-10 u-bg-gray" style="height: 100%;">
						<scroll-view :scroll-y="true" style="height: 100%">
							<u-cell-group>
								<u-cell v-for="(item,index) in provinces" :key="index" :title="item.label" :name="index"
								 @click="provinceChange">
									<view slot="right-icon">
										<u-icon v-if="isChooseP && province == index" size="48rpx" name="checkbox-mark" color="green"></u-icon>
									</view>
								</u-cell>
							</u-cell-group>
						</scroll-view>
					</view>
				</view>
				<view v-if="isChooseP" class="area-item">
					<view class="u-padding-10 u-bg-gray" style="height: 100%;">
						<scroll-view :scroll-y="true" style="height: 100%">
							<u-cell-group>
								<u-cell v-for="(item,index) in citys" :key="index" :title="item.label" :name="index"
								 @click="cityChange">
									<view slot="right-icon">
										<u-icon v-if="isChooseC && city == index" size="48rpx" name="checkbox-mark" color="green"></u-icon>
									</view>
								</u-cell>
							</u-cell-group>
						</scroll-view>
					</view>
				</view>

				<view v-if="isChooseC && level >= 3" class="area-item">
					<view class="u-padding-10 u-bg-gray" style="height: 100%;">
						<scroll-view :scroll-y="true" style="height: 100%">
							<u-cell-group>
								<u-cell v-for="(item,index) in areas" :key="index" :title="item.label" :name="index"
								 @click="areaChange">
									<view slot="right-icon">
										<u-icon v-if="isChooseA&&area == index" size="48rpx" name="checkbox-mark" color="green"></u-icon>
									</view>
								</u-cell>
							</u-cell-group>
						</scroll-view>
					</view>
				</view>
				
				<view v-if="isChooseA && level >= 4" class="area-item">
					<view class="u-padding-10 u-bg-gray" style="height: 100%;">
						<scroll-view :scroll-y="true" style="height: 100%">
							<u-cell-group>
								<u-cell v-for="(item,index) in streets" :key="index" :title="item.label" :name="index"
								 @click="streetChange">
									<view slot="right-icon">
										<u-icon v-if="isChooseS&&street == index" size="48rpx" name="checkbox-mark" color="green"></u-icon>
									</view>
								</u-cell>
							</u-cell-group>
						</scroll-view>
					</view>
				</view>
			</view>
		</view>
	</u-popup>
</template>

<script>
	/**
	 * city-select 省市区级联选择器
	 * @property {String Number} z-index 弹出时的z-index值（默认1075）
	 * @property {Boolean} mask-close-able 是否允许通过点击遮罩关闭Picker（默认true）
	 * @property {String} default-region 默认选中的地区，中文形式
	 * @property {String} default-code 默认选中的地区，编号形式
	 */
	export default {
		name: 'city-select',
		props: {
			// 通过双向绑定控制组件的弹出与收起
			value: {
				type: Boolean,
				default: false
			},
			// 默认显示的地区，可传类似["河北省", "秦皇岛市", "北戴河区"]
			defaultRegion: {
				type: Array,
				default () {
					return [];
				}
			},
			// 默认显示地区的编码，defaultRegion和areaCode同时存在，areaCode优先，可传类似["13", "1303", "130304"]
			areaCode: {
				type: Array,
				default () {
					return [];
				}
			},
			// 是否允许通过点击遮罩关闭Picker
			maskCloseAble: {
				type: Boolean,
				default: true
			},
			// 弹出的z-index值
			zIndex: {
				type: [String, Number],
				default: 0
			},
			level: {
				type: Number,
				default: 3
			}
		},
		data() {
			return {
				cityValue: "",
				isChooseP: false, //是否已经选择了省
				province: 0, //省级下标
				provinces: [],
				isChooseC: false, //是否已经选择了市
				city: 0, //市级下标
				citys: [],
				isChooseA: false, //是否已经选择了区
				area: 0, //区级下标
				areas: [],
				isChooseS: false, //是否已经选择了街道
				street: 0, //街道下标
				streets: [],
				tabsIndex: 0,
			}
		},
		watch: {
			areaCode: {
				deep: true,
				immediate: true,
				handler(newVal, oldName) {
					this.init();
				}
			}
		},
		mounted() {
			// this.init();
		},
		computed: {
			isChange() {
				return this.tabsIndex > 1;
			},
			genTabsList() {
				let tabsList = [{
					name: "请选择"
				}];
				if (this.isChooseP) {
					tabsList[0]['name'] = this.provinces[this.province]['label'];
					tabsList[1] = {
						name: "请选择"
					};
				}
				if (this.isChooseC) {
					tabsList[1]['name'] = this.citys[this.city]['label'];
					if(this.level >= 3) {
						tabsList[2] = {
							name: "请选择"
						};
					}
				}
				if (this.isChooseA && this.level >= 3) {
					tabsList[2]['name'] = this.areas[this.area]['label'];
					if(this.level >= 4) {
						tabsList[3] = {
							name: "请选择"
						};
					}
				}
				if (this.isChooseS && this.level >= 4) {
					tabsList[3]['name'] = this.streets[this.street]['label'];
				}
				return tabsList;
			},
			uZIndex() {
				// 如果用户有传递z-index值，优先使用
				return this.zIndex ? this.zIndex : this.$u.zIndex.popup;
			}
		},
		methods: {
			async init() {
				// 获取所有的省份
				// https://www.yuque.com/apifm/nu0f75/anab2a
				const res = await this.$wxapi.province()
				this.provinces = []
				if(res.code == 0) {
					res.data.forEach(ele => {
						this.provinces.push({
							label: ele.name,
							value: ele.id
						})
					})
				}
				if(this.level == 2) {
					if (this.areaCode.length >= 2) {
						await this.setProvince("", this.areaCode[0]);
						await this.setCity("", this.areaCode[1]);
					} else if (this.defaultRegion.length >= 2) {
						await this.setProvince(this.defaultRegion[0], "");
						await this.setCity(this.defaultRegion[1], "");
					}
				}
				if(this.level == 3) {
					if (this.areaCode.length >= 3) {
						await this.setProvince("", this.areaCode[0]);
						await this.setCity("", this.areaCode[1]);
						await this.setArea("", this.areaCode[2]);
					} else if (this.defaultRegion.length >= 3) {
						await this.setProvince(this.defaultRegion[0], "");
						await this.setCity(this.defaultRegion[1], "");
						await this.setArea(this.defaultRegion[2], "");
					}
				}
				if(this.level == 4) {
					if (this.areaCode.length >= 4) {
						await this.setProvince("", this.areaCode[0]);
						await this.setCity("", this.areaCode[1]);
						await this.setArea("", this.areaCode[2]);
						await this.setStreet("", this.areaCode[3]);
					} else if (this.defaultRegion.length >= 4) {
						await this.setProvince(this.defaultRegion[0], "");
						await this.setCity(this.defaultRegion[1], "");
						await this.setArea(this.defaultRegion[2], "");
						await this.setStreet(this.defaultRegion[3], "");
					}
				}
			},
			async setProvince(label = "", value = "") {
				const k = this.provinces.findIndex(v => {
					return value ? v.value == value : v.label == label
				})
				console.log(k);
				if(k != -1) {
					const v = this.provinces[k]
					await this.provinceChange({ name: k })
				}
			},
			async setCity(label = "", value = "") {
				const k = this.citys.findIndex(v => {
					return value ? v.value == value : v.label == label
				})
				if(k != -1) {
					const v = this.citys[k]
					await this.cityChange({ name: k }, true)
				}
			},
			async setArea(label = "", value = "") {
				const k = this.areas.findIndex(v => {
					return value ? v.value == value : v.label == label
				})
				if(k != -1) {
					const v = this.areas[k]
					if(this.level == 3) {
						this.isChooseA = true;
						this.area = k;
					}
					if(this.level == 4) {
						await this.areaChange({ name: k })
					}
				}
			},
			async setStreet(label = "", value = "") {
				const k = this.streets.findIndex(v => {
					return value ? v.value == value : v.label == label
				})
				if(k != -1) {
					const v = this.streets[k]
					this.isChooseS = true;
					this.street = k;
				}
			},
			close() {
				this.$emit('input', false);
			},
			tabsChange(e) {
				this.tabsIndex = e.index;
				if(e.index == 0) {
					this.provinceChange({ name: this.province })
				}
				if(e.index == 1) {
					this.cityChange({ name: this.city }, true)
				}
				if(e.index == 2) {
					this.areaChange({ name: this.area })
				}
				if(e.index == 3) {
					this.streetChange({ name: this.street })
				}
			},
			async provinceChange(e) {
				console.log(e);
				const index = e.name
				this.isChooseP = true;
				this.isChooseC = false;
				this.isChooseA = false;
				this.isChooseS = false;
				this.province = index;
				// https://www.yuque.com/apifm/nu0f75/kfukig
				const res = await this.$wxapi.nextRegion(this.provinces[index].value)
				this.citys = []
				if(res.code == 0) {
					res.data.forEach(ele => {
						this.citys.push({
							label: ele.name,
							value: ele.id
						})
					})
				}
				// 接口读取结束
				this.tabsIndex = 1;
			},
			async cityChange(e, initAction) {
				const index = e.name
				this.isChooseC = true;
				this.isChooseA = false;
				this.isChooseS = false;
				this.city = index;
				if(this.level == 2) {
					if (!initAction) {
						let result = {};
						result.province = this.provinces[this.province];
						result.city = this.citys[this.city];
						this.$emit('city-change', result);
						this.close();
					}
					return
				}
				// https://www.yuque.com/apifm/nu0f75/kfukig
				const res = await this.$wxapi.nextRegion(this.citys[index].value)
				this.areas = []
				if(res.code == 0) {
					res.data.forEach(ele => {
						this.areas.push({
							label: ele.name,
							value: ele.id
						})
					})
				}
				// 接口读取结束
				this.tabsIndex = 2;
			},
			async areaChange(e) {
				const index = e.name
				this.isChooseA = true;
				this.isChooseS = false;
				this.area = index;
				if(this.level == 3) {
					let result = {};
					result.province = this.provinces[this.province];
					result.city = this.citys[this.city];
					result.area = this.areas[this.area];
					this.$emit('city-change', result);
					this.close();
				}
				if(this.level == 4) {
					// https://www.yuque.com/apifm/nu0f75/kfukig
					const res = await this.$wxapi.nextRegion(this.areas[index].value)
					this.streets = []
					if(res.code == 0) {
						res.data.forEach(ele => {
							this.streets.push({
								label: ele.name,
								value: ele.id
							})
						})
					}
					// 接口读取结束
					this.tabsIndex = 3;
				}
			},
			streetChange(e) {
				const index = e.name
				this.isChooseS = true;
				this.street = index;
				let result = {};
				result.province = this.provinces[this.province];
				result.city = this.citys[this.city];
				result.area = this.areas[this.area];
				result.street = this.streets[this.street];
				this.$emit('city-change', result);
				this.close();
			}
		}

	}
</script>
<style lang="scss">
	.area-box {
		width: 100%;
		overflow: hidden;
		height: 800rpx;

		>view {
			width: 150%;
			transition: transform 0.3s ease-in-out 0s;
			transform: translateX(0);

			&.change {
				transform: translateX(-0%);
			}
		}
		.u-flex {
			width: 100vw;
			display: flex;
			.area-item {
				flex: 1;
				height: 800rpx;
			}
		}
	}
</style>
