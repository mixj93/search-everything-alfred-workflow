// taptap
var keyword = process.argv[2]
var path = require('path')
var cheerio = require('cheerio');
var superagent = require('superagent');
var moment = require('moment');

console.error('关键词', keyword)

superagent.get(`https://www.taptap.com/search/apps?kw=${keyword}`)
.end(function (err, res) {
  if (err) {
    console.error('获取 TapTap 信息出错', err);
  }
  var $ = cheerio.load(res.text);
  var result_array = []
  $('.search-main-body .taptap-app-card').each(function(index, item) {
    var name = $(item).find('.app-card-left img').attr('title')
    var author = $(item).find('.card-right-author a').text()
    var href = $(item).find('.app-card-left').attr('href')
    var rate = $(item).find('.card-right-rating span').text()
    var info = $(item).find('.card-right-times') ? $(item).find('.card-right-times').text() : ''
    var tagsArr = []
    $(item).find('.card-tags a').each(function(tagIndex, tag) {
      tagsArr.push($(tag).text())
    })

    result_array.push({
      title: name,
      subtitle: `${author} 评分：${rate} ${info} 标签：${tagsArr.join(',')}`,
      arg: href,
      type: 'default',
      icon: {
        type: 'default',
        path: './9C27BB27-86CE-42BC-B0A9-8ACE8302B9F0.png'
      }
    })
  })
  result_array.push({
    title: '查看更多',
    subtitle: '查看更多匹配结果',
    arg: `https://www.taptap.com/search/apps?kw=${keyword}`,
    type: 'default',
    icon: {
      type: 'default',
      path: './9C27BB27-86CE-42BC-B0A9-8ACE8302B9F0.png'
    }
  })
  console.log(JSON.stringify({
    items: result_array
  }))

});
