// pages/movies/more-movie/more-movie.js
const app = getApp();
const util = require("../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies: {},
    totalCount: 0,
    nextUrl: "",
    isEmpty: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var category = options.category;
    var dataUrl = "";
    // console.log(category);
    wx.setNavigationBarTitle({
      title: category
    });

    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;
      case "豆瓣top250":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    };

    this.setData({
      dataUrl: dataUrl
    });
    util.http(dataUrl, this.processMoviesData);
    wx.showNavigationBarLoading();
  },

  onMovieTap: function (e) {
    var movieId = e.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId
    })
  },

  processMoviesData: function (moviesData) {
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
    //加载更多的数据，需将已有的数据与新数据进行合并
    var totalMovies = [];
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies)
    } else {
      totalMovies = movies;
      this.setData({
        isEmpty: false
      })
    } 
    this.setData({
      movies: totalMovies,
      totalCount: this.data.totalCount += 20
    });
    wx.hideNavigationBarLoading();
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var refreshUrl = this.data.dataUrl + "?start=0&count=20";
    this.setData({
      movies:{},
      isEmpty:true,
      totalCount:0
    });
    util.http(refreshUrl, this.processMoviesData);
    wx.showNavigationBarLoading();
  },

  onReachBottom:function(){
    var nextUrl = this.data.dataUrl + "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processMoviesData);
    wx.showNavigationBarLoading();
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})