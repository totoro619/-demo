const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function starsArray(stars) {
  var num = stars.substring(0, 1);
  var starsArray = [];
  for (var i = 1; i <= 5; i++) {
    if (i <= num) {
      starsArray.push(1)
    }
    else {
      starsArray.push(0)
    }
  }
  return starsArray
}

function castString(casts) {
  var castsjoin = [];
  for (var i in casts) {
    var name = casts[i].name;
    castsjoin.push(name);
  }
  return castsjoin.join("/")
}

function castInfoString(casts) {
  var castsjoin = [];
  for (var i in casts) {
    var castsInfo = {};
    castsInfo.img = casts[i].avatars ? casts[i].avatars.large : "";
    castsInfo.name = casts[i].name;
    castsjoin.push(castsInfo);
  }
  return castsjoin;
}

function http(url, callback) {
  wx.request({
    url: url,
    header: {
      "Content-Type": "json"
    },
    method: 'GET',
    dataType: 'json',
    success: function (res) {
      // console.log(res.data);
      callback(res.data);
    },
    fail: function (res) {
      console.log(res)
    }
  })
}

module.exports = {
  formatTime: formatTime,
  starsArray: starsArray,
  http: http,
  castString: castString,
  castInfoString: castInfoString
}
