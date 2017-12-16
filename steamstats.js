// steamstats
var path = require('path')
var cheerio = require('cheerio');
var superagent = require('superagent');

superagent.get(`http://store.steampowered.com/stats`)
.end(function (err, res) {
  if (err) {
    console.error('获取 Steam 统计信息', err);
  }
  var $ = cheerio.load(res.text);
  var result_array = []

  $('#detailStats tr.player_count_row').each(function(index, item) {
    var name = $(item).find('.gameLink').text()
    var link = $(item).find('.gameLink').attr('href')
    var current = $(item).find('.currentServers').first().text()
    var peak = $(item).find('.currentServers').last().text()

    result_array.push({
      title: name,
      subtitle: `当前游戏人数：${current} 今日峰值：${peak}`,
      arg: link,
      type: 'default',
      icon: {
        type: 'default',
        path: './4346CE99-482A-4DA7-957F-759B9955D315.png'
      }
    })
  })
  result_array.push({
    title: '查看详细统计信息',
    subtitle: '',
    arg: `http://store.steampowered.com/stats`,
    type: 'default',
    icon: {
      type: 'default',
      path: './4346CE99-482A-4DA7-957F-759B9955D315.png'
    }
  })
  console.log(JSON.stringify({
    items: result_array
  }))

});
