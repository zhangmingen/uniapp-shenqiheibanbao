const showToast = (msg,time) => {
	uni.showToast({
		title: msg,
		duration: time,
		icon:'none'
	});
}

const showLoading = (msg) => {
	uni.showLoading({
	    title: msg
	});
}

const showModal = (title,content,cancelText='取消',confirmText='确定',showCancel) => {
	console.log(cancelText,confirmText)
  return new Promise((resolve, reject) => {
    uni.showModal({
        title: title,
        content: content,
		cancelText:cancelText,
		confirmText:confirmText,
		showCancel:showCancel,
        success: (res) => {
            if (res.confirm) {
                resolve(true)
            } else if (res.cancel) {
                resolve(false)
            }
        }
    });
  })
}

const popup = {
	showToast,
	showLoading,
  showModal
}

export default popup
