const axios = require('axios');
const cheerio = require('cheerio-without-node-native');

/**
 * @param {string} url - Genius URL
 */
module.exports = async function (url) {
	try {
		let { data } = await axios.get(url); //url에서 데이터 받아오기
		const $ = cheerio.load(data); //html 데이터를 파싱하고 jquery처럼 사용
		let lyrics = $('div[class="lyrics"]').text().trim(); //lyrics 클래스에서 text만 추출
		if (!lyrics) {
			lyrics = '';
			$('div[class^="Lyrics__Container"]').each((i, elem) => {
				if ($(elem).text().length !== 0) {
					let snippet = $(elem)
						.html() // 해당 요소의 HTML을 가져옴
						.replace(/<br>/g, '\n') // <br> 태그를 줄바꿈으로 대체
						.replace(/<(?!\s*br\s*\/?)[^>]+>/gi, '');  // <br> 외의 모든 태그를 제거
					lyrics += $('<textarea/>').html(snippet).text().trim() + '\n\n'; // HTML 엔티티를 변환하여 텍스트로 변환하고, 각 가사 구간을 개행으로 구분합니다.
				}
			});
		}
		if (!lyrics) return null;
		return lyrics.trim();
	} catch (e) {
		throw e;
	}
};
