// steam
var keyword = process.argv[2]
var path = require('path')
var cheerio = require('cheerio');
var superagent = require('superagent');
var moment = require('moment');

console.error('关键词', keyword)

var steamReviewMap = {
  'overwhelmingly_positive': '好评如潮',
  'very_positive': '特别好评',
  'positive': '好评',
  'mostly_positive': '多半好评',
  'mixed': '褒贬不一',
  'mostly_negative': '多半差评',
  'negative': '差评'
}

function getSteamReviewName(review) {
  if (!review) {
    return '暂无评价'
  } else {
    let rawReview = review.split('<br>')[0]
    let reviewKey = rawReview.split(' ').join('_').toLowerCase()
    console.error(reviewKey)
    return steamReviewMap[reviewKey] || rawReview
  }
}

superagent.get(`http://store.steampowered.com/search/?term=${keyword}`)
.end(function (err, res) {
  if (err) {
    console.error('获取磁力站信息出错', err);
  }
  var $ = cheerio.load(res.text);
  var result_array = []

  $('.search_result_row').each(function(index, item) {
    console.error('image src', $(item).find('.search_capsule img').attr('src'))
    var release_date = moment($(item).find('.search_released').text().trim()).format('YYYY年MM月DD日')
    var review = getSteamReviewName($(item).find('.search_review_summary').attr('data-store-tooltip'))
    var price = $(item).find('.search_price').text().trim()
    var platformArr = []
    if ($(item).find('.platform_img.win').length > 0) { platformArr.push('Win') }
    if ($(item).find('.platform_img.mac').length > 0) { platformArr.push('Mac') }
    if ($(item).find('.platform_img.linux').length > 0) { platformArr.push('Linux') }
    if ($(item).find('.platform_img.htcvive').length > 0) { platformArr.push('HTC Hive') }
    if ($(item).find('.platform_img.oculusrift').length > 0) { platformArr.push('Oculus Rift') }
    result_array.push({
      title: $(item).find('.search_name .title').text(),
      subtitle: `发行时间：${release_date} 价格：${price} 评价：${review} 平台：${platformArr.join(',')}`,
      arg: $(item).attr('href'),
      type: 'default',
      icon: {
        type: 'default',
        path: './4346CE99-482A-4DA7-957F-759B9955D315.png'
      }
    })
  })
  result_array.push({
    title: '查看更多',
    subtitle: '查看更多匹配结果',
    arg: `http://store.steampowered.com/search/?term=${keyword}`,
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
