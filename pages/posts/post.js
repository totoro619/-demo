var postsData = require('../../data/posts-data.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({
      postList: postsData.postList
    })
  },

  onPostTap: function (e) {
    var postId = e.currentTarget.dataset.postid;
    

    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId
    })
  },

  onSwiperTap:function(e){
    var postId=e.target.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId
    })
  }


})