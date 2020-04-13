const handleSubmit = require('../src/client/js/handleSubmit');

test ("",()=>{
    const dayms = 1000 * 60 * 60 * 24;
    const d=new Date()+dayms;   //tomorrow
    const y = d.getFullYear();
	const m = d.getMonth() + 1;
	const a = d.getDate();
    const dep = new Date(y + "-" + m + "-" + a);
     d=d +dayms;   //1 day after tomorrow
     y = d.getFullYear();
	 m = d.getMonth() + 1;
     a = d.getDate();
     const arr = new Date(y + "-" + m + "-" + a);

    const output={
        "duration": 2,
        "end": 2,
        "isOutOfRange": false,
        "isPartial": false,
        "isRetInvalid": false,
        "limit": 18380,
        "start": 1,
        "timer": dep
    }

    expect(handleSubmit.importantDays(dep, arr)).toBe(output);
});