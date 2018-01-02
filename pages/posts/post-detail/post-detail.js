const postsData = require('../../../data/posts-data.js');
const app = getApp();

Page({
  data: {
    isPlayingMusic: false
  },

  onLoad: function (options) {
    console.log('onLoad');
    var postId = options.id;
    var postData = postsData.postList[postId];
    this.setData({
      postData: postData,
      currentId: postId
    });

    //假如缓存数据格式为：
    //postsCollected={
    //    1:'true',
    //    2:'false,
    //    3:'true',
    //    ...
    //}

    var postsCollected = wx.getStorageSync('posts_collection');
    if (postsCollected) {
      var collectionState = postsCollected[postId];
      this.setData({
        hasCollected: collectionState
      })
    } else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collection', postsCollected)
    }

    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentPlayingPostId===postId){
      this.setData({
        isPlayingMusic:true
      })
    }

    this.setMusicMonitor();
  },

  setMusicMonitor: function () {
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayingMusic: true
      });
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_currentPlayingPostId=postId;
    });
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false
      });
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentPlayingPostId=null;
    });
    wx.onBackgroundAudioStop(function(){
      that.setData({
        isPlayingMusic: false
      });
      // app.globalData.g_isPlayingMusic = false;
      // app.globalData.g_currentPlayingPostId = null;
    })
  },

  onCollectionTap: function (e) {
    var postsCollected = wx.getStorageSync('posts_collection');
    var postCollected = postsCollected[this.data.currentId];
    //收藏与未收藏之间的转换
    postCollected = !postCollected;
    postsCollected[this.data.currentId] = postCollected;
    this.showToast(postCollected, postsCollected)
  },

  showToast: function (postCollected, postsCollected) {
    //更新文章是否收藏的缓存值
    wx.setStorageSync('posts_collection', postsCollected);
    //更新数据绑定变量，从而实现切换图片
    this.setData({
      hasCollected: postCollected
    })
    wx.showToast({
      title: postCollected ? '收藏成功' : '取消收藏',
      duration: 1000,
      mask: true
    })
  },

  onShareTap: function (e) {
    var itemList = [
      "分享到微信朋友圈",
      "分享到微博",
      "分享到QQ空间"
    ];
    wx.showActionSheet({
      itemList: itemList,
      success: function (res) {
        wx.showModal({
          title: '分享',
          content: '已成功' + itemList[res.tapIndex] + '（未调用后台api）',
          showCancel: false,
        })
      }
    })
  },

  onMusicTap: function () {
    var postData = this.data.postData;
    var isPlayingMusic = this.data.isPlayingMusic;
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      });
     
    } else {
      wx.playBackgroundAudio({
        dataUrl: postData.music.url,
        title: postData.music.title,
        coverImgUrl: postData.music.coverImg
      });
      this.setData({
        isPlayingMusic: true
      });
      
    }
  },
})