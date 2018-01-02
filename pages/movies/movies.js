const app = getApp();
const util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheater: {},
    comingSoon: {},
    top250: {},
    searchResult:{},
    inputValue:"",
    containerShow: true,
    searchPanelShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var inTheaterUrl = app.globalData.doubanBase + "/v2/movie/in_theaters?start=0&count=3";
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon?start=0&count=3";
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250?start=0&count=3";

    this.getMoviesData(inTheaterUrl, "inTheater", "正在热映");
    this.getMoviesData(comingSoonUrl, "comingSoon", "即将上映");
    this.getMoviesData(top250Url, "top250", "豆瓣top250");
  },

  onMoreTap: function (e) {
    var category = e.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movie/more-movie?category=' + category
    })
  },

  onMovieTap:function(e){
    var movieId=e.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + movieId
    })
  },

  getMoviesData: function (url, settedkey, category) {
    var that = this;
    wx.request({
      url: url,
      header: {
        "Content-Type": "application/xml"
      },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        // console.log(res.data);
        that.processMoviesData(res.data, settedkey, category);
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },

  processMoviesData: function (moviesData, settedkey, category) {
    var movies = [];
    for (var idx in moviesData.subjects) {
      var subject = moviesData.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "..."
      }
      var temp = {
        title: title,
        stars: util.starsArray(subject.rating.stars),
        average: subject.rating.average,
        coverImg: subject.images.large,
        movieId: subject.id
      };
      movies.push(temp);
    }
    var readyData = {};
    readyData[settedkey] = {
      category: category,
      movies: movies
    };
    this.setData(readyData)
  },

  onBindFocus: function (e) {
    this.setData({
      containerShow: false,
      searchPanelShow: true,
      inputValue:e.detail.value
    })
  },

  onCancelTap: function (e) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult:{},
      inputValue:""
    })
  },

  onBindConfirm: function (e) {
    var inputValue = e.detail.value;
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + inputValue;
    this.getMoviesData(searchUrl, "searchResult", "");
  }


})