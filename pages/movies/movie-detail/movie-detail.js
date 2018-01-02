// pages/movies/movie-detail/movie-detail.js
const app = getApp();
const util = require("../../../utils/util.js");

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		moviesData: {}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		var movieId = options.id;
		var url = app.globalData.doubanBase + "/v2/movie/subject/" + movieId;
		util.http(url, this.processMovieData);
	},

	processMovieData: function(data) {
		console.log(data);
		var director = {
			avatar: "",
			name: "",
			id: ""
		};

		if (data.directors !== null) {
			if (data.directors[0].avatars !== null) {
				director.avatar = data.directors[0].avatars.large;
			}
			director.name = data.directors[0].name;
			director.id = data.directors[0].id;
		}

		var moviesData = {
			title: data.title,
			commentsCount: data.comments_count,
			wishCount: data.wish_count,
			year: data.year,
			summary: data.summary,
			movieImg: data.images ? data.images.large : "",
			generes: data.genres.join("、"),
			stars: util.starsArray(data.rating.stars),
			countries: data.countries.join("/"),
			director: director,
			casts: util.castString(data.casts),
			castsInfo: util.castInfoString(data.casts),
			average: data.rating.average,
			originalTitle: data.original_title
		};

		console.log(moviesData);

		this.setData({
			moviesData: moviesData
		})

	},

	/*查看图片*/
	viewMoviePostImg: function(e) {
		var src = e.currentTarget.dataset.src;
		wx.previewImage({
			current: src, // 当前显示图片的http链接
			urls: [src] // 需要预览的图片http链接列表
		})
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {

	}
})