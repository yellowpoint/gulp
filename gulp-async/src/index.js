let a=1
async function asyncWork() {
	var data = await $.get('https://api.51app.cn/loanapi/home/v2').catch(err => {
		return err
	});
	return data.code

}

async function doWork() {
	let work1 = await asyncWork().catch(err => {
		console.log(err);
	});
	console.log(work1)
	console.log('22222')
	return work1
}
async function doWork2() {
	var array = [1, 2, 3]
	array.forEach(async(item) => {
		var work1 = await asyncWork()
		var work2 = await asyncWork()
		console.log(work1 + work2)
	})

	console.log(array)
}

function mainWork() {
	doWork().then(resp => {
		console.log('resp', resp)
	})
}

mainWork()
