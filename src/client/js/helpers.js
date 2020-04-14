 function importantDays(departStr, returnStr) {
	const dayms = 1000 * 60 * 60 * 24;

	let idays = {}
	var d = new Date(departStr);
	var y = d.getFullYear();
	var m = d.getMonth() + 1;
	var a = d.getDate();
	let dep = new Date(y + "-" + m + "-" + a);
	dep.setHours(0);
	dep.setMinutes(0);
	dep.setSeconds(0);
	idays.timer = dep;
	dep = dep / dayms;
	let ret = new Date(returnStr);
	ret = ret / dayms;
	d = new Date();
	y = d.getFullYear();
	m = d.getMonth() + 1;
	a = d.getDate();
	let current = new Date(y + "-" + m + "-" + a); //.getTime();
	current = truncate(current / dayms);
	let limit = current + 15;
	idays.limit = limit;
	idays.duration = Math.ceil(ret - dep);
	idays.start = Math.ceil(dep - current);
	idays.end = Math.ceil(ret - current);
	idays.isOutOfRange = (limit < dep) || (idays.start < 1);
	idays.isRetInvalid = ret < dep;
	idays.isPartial = ret > limit && dep <= limit;

	console.log(idays);

	return idays;
}

function truncate(value) {
	if (value < 0) {
		return Math.ceil(value);
	}

	return Math.floor(value);
}

// export {importantDays, truncate };
module.exports= {importantDays, truncate };