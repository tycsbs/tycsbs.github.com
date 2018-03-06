/*mock eventEmitter.js*/
(function () {
	var root = ( self && typeof self == 'object' && self.self == self) ||
		(global && typeof global == 'object' && global.global == global) ||
		this || {}

	/**
	 * 检测是否是监听函数
	 * @param listener
	 * @returns {*}
	 */
	function isListener(listener) {
		var type = typeof listener
		if (type === 'function') {
			return true
		} else if (type === 'object') {
			return isListener(listener.listener)
		} else {
			return false
		}
	}

	/**
	 * 查找指定监听item的索引
	 * @param list 监听函数集合
	 * @param item 目标item
	 * @returns {number}
	 */
	function findListenerIndex(list, item) {
		var reselt = -1
		item = typeof item === 'object'
			? item.isListener
			: item
		for (var i = 0; i < list.length; i++) {
			if (list[i].listener === item) {
				reselt = i
				break
			}
		}
		return reselt
	}

	// emmiter event
	function Emitter() {
		this._events = {}
	}

	var proto = Emitter.prototype

	proto.on = function (eventName, listener) {
		if (!eventName || !listener) return

		if (!isListener(listener)) {
			throw new Error("listener must be a function")
		}

		var events = this._events
		var listenerList = events[eventName] || []
		var listenerIsObj = typeof listener === 'object'

		//添加事件到集合
		if (findListenerIndex(listenerList, listener) === -1) {
			listenerList.push(listenerIsObj ? listener : {
					listener: listener,
					once: false
				})
		}
	}

	proto.off = function (eventName, listener) {
		var listenerList = this._events[eventName]
		if (!listenerList) return
		// 找出listener 在list索引
		var index = -1
		for (var i = 0; i < listenerList.length; i++) {
			if(listenerList[i] && listenerList[i].listener === listener) {
				index = i
				break
			}
		}
		// 删除
		if(index !== -1) {
			listenerList.splice(index, 1, null)
		}
		return this
	}



}())