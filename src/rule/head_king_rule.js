const request = require('request');
var cheerio = require("cheerio");

/**
 * [searchResult 百度搜索问题]
 * @param  {[string]} question    [问题描述]
 * @param  {[array]} answerArray  [答案数组]
 * @return {[array]}              [答案数组]
 */
function searchResult(question, answerArray) {
	return new Promise((resolve, reject) => {
		let url = 'http://www.baidu.com/s?wd=' + encodeURI(question);
		request(url, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				let $ = cheerio.load(body);
				let searchString = $('#content_left').text();
				for (i in answerArray) {
					let reg = new RegExp(answerArray[i], "g");
					let regResult = searchString.match(reg);
					let count = regResult ? regResult.length : 0;
					answerArray[i] += '[' + count + ']';
				}
				resolve(answerArray);
			}
		})
	})
}

module.exports = {
	summary: '头脑王者的规则',
	* beforeSendResponse(requestDetail, responseDetail) {
		if (requestDetail.url === 'https://question.hortor.net/question/bat/findQuiz') {
			let newResponse = Object.assign({}, responseDetail.response);
			let JsonBody = JSON.parse(newResponse.body.toString());
			return new Promise((resolve, reject) => {
				searchResult(JsonBody.data.quiz, JsonBody.data.options)
					.then((data) => {
						JsonBody.data.options = data;
						newResponse.body = JSON.stringify(JsonBody);
						resolve({
							response: newResponse
						});
					})
			});
		}
	},
}