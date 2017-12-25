// hearthstone
var keyword = process.argv[2];
var cheerio = require('cheerio');
var superagent = require('superagent');
var request = require('request-promise');
var q = require('q');
var maxItemCount = 10;

superagent.get(`http://cha.17173.com/hs/search?q=${encodeURIComponent(keyword)}`)
.end(function (err, res) {
  if (err) {
    console.error('获取17173卡牌库出错', err);
  }
  var $ = cheerio.load(res.text);
  console.error($)
  var result_array = []
  var cardInfoPromises = []
  var linkArr = []

  $('.games_con .games_list a').each(function(index, item) {
    var link = $(item).attr('href')
    if (index < maxItemCount) {
      linkArr.push(link)
      var cardId = link.split('/')[link.split('/').length - 1]
      cardInfoPromises.push(request.get(`http://cha.17173.com/hs/index/tips/c/UTF-8/t/card_zhcn/l/zhCN/id/${cardId}`))
    }
  })
  // console.log('cardInfoPromises', cardInfoPromises)

  q.all(cardInfoPromises).then(function(data) {
    // console.log('data', data)
    data.forEach(function(d, i) {
      var html = '<div ' + d.split('<div').slice(1,-1).join('<div').trim()
      var $ = cheerio.load(html)
      var name = $('.pop-tit').text()
      var desc = $('.pop-nr').text()
      var job = $('.pop-box1 .pop-box1').text()
      var type = $('.pop-box2 .pop-box2').text()
      result_array.push({
        title: `${name} ${job} ${type}`,
        subtitle: desc,
        arg: `http://cha.17173.com${linkArr[i]}`,
        type: 'default',
        icon: {
          type: 'default',
          path: './35CF4B4F-DD2E-42F4-8F9B-5003000CCD0B.png'
        }
      })
    })

    result_array.push({
      title: '查看更多',
      subtitle: '查看更多匹配结果',
      arg: `http://cha.17173.com/hs/search?q=${keyword}`,
      type: 'default',
      icon: {
        type: 'default',
        path: './35CF4B4F-DD2E-42F4-8F9B-5003000CCD0B.png'
      }
    })
    console.log(JSON.stringify({
      items: result_array
    }))

  })

});
