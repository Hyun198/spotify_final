const checkOptions = (options) => {
	let { apiKey, title, artist } = options;
	if (!apiKey) {
		throw '"apiKey" property is missing from options';
	} else if (!title) {
		throw '"title" property is missing from options';
	} else if (!artist) {
		throw '"artist" property is missing from options';
	}
};

const getTitle = (title, artist) => {
	return `${title} ${artist}`
		.toLowerCase()  //제거할 패턴들
		.replace(/ *\([^)]*\) */g, '') // ()안에 있는 내용이랑, 괄호 양쪽에 있는 공백 제거
		.replace(/ *\[[^\]]*]/, '') // []안에 있는 내용이랑, 괄호 양쪽에 있는 공백 제거
		.replace(/feat.|ft./g, '') //feat. ft. 제거
		.replace(/\s+/g, ' ') // 여러개의 공백을 하나의 공백으로 축소
		.trim(); // 문자열 앞뒤 공백 제거
};

module.exports = { checkOptions, getTitle };
