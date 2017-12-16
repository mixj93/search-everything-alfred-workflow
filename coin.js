// coin
var path = require('path')
var cheerio = require('cheerio');
var superagent = require('superagent');

function toCny(usd, rate) {
  return `￥${(usd / rate).toFixed(2)}`
}

superagent.get(`https://coinmarketcap.com/zh/`)
.end(function (err, res) {
  if (err) {
    console.error('获取 coinmarketcap.com 出错', err);
  }
  var $ = cheerio.load(res.text);
  var result_array = []
  var cnyExchangeRate = $('#currency-exchange-rates').attr('data-cny')
  $('table tbody tr').each(function(index, item) {
    var name = $(item).find('.currency-name-container').text()
    var href = $(item).find('.currency-name-container').attr('href')
    var market_cap = $(item).find('.market-cap').attr('data-usd')
    var price = $(item).find('.price').attr('data-usd')
    var volume = $(item).find('.volume').attr('data-usd')
    var change = $(item).find('.percent-24h').text()
    var symbol = change.indexOf('-') === 0 ? '↓' : '↑'
    var supply = $(item).find('.circulating-supply a').attr('data-supply')
    var supply_unit = $(item).find('.circulating-supply span.hidden-xs').text()

    result_array.push({
      title: `${name}: ${toCny(price, cnyExchangeRate)}`,
      subtitle: `${symbol}${change} 市值: ${toCny(market_cap, cnyExchangeRate)} 流通量：${parseInt(supply)} ${supply_unit} 交易量: ${toCny(volume, cnyExchangeRate)}`,
      arg: `https://coinmarketcap.com${href}`,
      type: 'default',
      icon: {
        type: 'default',
        path: './304E09E9-C47A-46B4-B31D-CCFC121CAA24.png'
      }
    })
  })
  result_array.push({
    title: '查看更多',
    subtitle: '查看更多结果',
    arg: `https://coinmarketcap.com/zh/`,
    type: 'default',
    icon: {
      type: 'default',
      path: './304E09E9-C47A-46B4-B31D-CCFC121CAA24.png'
    }
  })
  console.log(JSON.stringify({
    items: result_array
  }))

});
