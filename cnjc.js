// coin
var path = require('path')
var cheerio = require('cheerio');
var superagent = require('superagent');

superagent.get(`http://www.runoob.com/`)
.end(function (err, res) {
  if (err) {
    console.error('获取 coinmarketcap.com 出错', err);
  }
  var $ = cheerio.load(res.text);
  var result_array = []
  var cnyExchangeRate = $('#currency-exchange-rates').attr('data-cny')
  $('.codelist-desktop a.item-top.item-1').each(function(index, item) {
    var name = $(item).find('h4').text()
    var desc = $(item).find('strong').text()
    var link = $(item).attr('href')

    result_array.push({
      title: `${name}`,
      subtitle: `${desc}`,
      arg: `http:${link}`,
      type: 'default',
      icon: {
        type: 'default',
        path: './A6084C35-C6EE-4930-8FFE-230AA9E852A2.png'
      }
    })
  })
  result_array.push({
    title: '查看更多',
    subtitle: '查看更多结果',
    arg: `http://www.runoob.com/`,
    type: 'default',
    icon: {
      type: 'default',
      path: './A6084C35-C6EE-4930-8FFE-230AA9E852A2.png'
    }
  })
  console.log(JSON.stringify({
    items: result_array
  }))

});
