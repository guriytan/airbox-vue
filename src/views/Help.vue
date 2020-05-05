<template>
  <div class="help-container">
    <el-card class="title-card" shadow="hover">
      <svg-icon icon-class="help" class="title-icon"></svg-icon>
      <span class="title-header">使用帮助</span>
    </el-card>
    <el-col :span="14">
      <el-card class="content-card" shadow="hover">
        <div class="content-title">用户须知</div>
        <el-collapse v-model="activeNames" class="content">
          <el-collapse-item title="关于服务" name="1">
            <div>这个网站就是自己写来保存一下文件的，主要就是免得浪费买的服务器磁盘资源。所以就不面向公众开放了不过这样子也不知道
              当初写用户注册登录逻辑那么费劲干嘛。所以除了储存服务之外，本网站可免费为游客提供源码自行搭建。源码地址在右边的github
              中可以获取。如果发现bug，或者说在你进行相关操作后却没有成功或者失败的提示信息，请务必留言至github中。
            </div>
          </el-collapse-item>
          <el-collapse-item title="用户权益" name="2">
            <div>因为服务器磁盘也就40G，所以我就设了每个用户20G空间而已，就是试试水嘛。看了看其他人写的云盘，发现他们对上传文件
              都有限制，其实主要是因为他们都直接对Request进行ParseMultipartForm了，我这里用的是流的方式读取，所以最大文件限制在
              4G，并且下载也仅能在登录后才能下载。但这里有个问题，就是为了减轻服务器的负担，原本是采用websocket方法回显进度的，现在
              改为js原生的onUploadProgress方案，因此不是十分准确的回显上传过程，文件越大，进度条达到100%到真正上传成功之间的时间也会
              越长，因此请务必等到提示上传成功为止。
            </div>
          </el-collapse-item>
          <el-collapse-item title="文件操作" name="3">
            <div>当然可以对文件进行上传和删除操作，并且还能进行文件夹的逻辑储存。但是一开始没想到复制和移动功能，后面看看有没有必
              要加上去吧。商业网盘一般不对文件做真实删除操作，可能主要是为了秒传服务吧。不过我这里因为空间有限，所以删除文件会确
              切删除，而且当删除文件夹时因为需要迭代删除所以可能会等待一段时间。
            </div>
          </el-collapse-item>
          <el-collapse-item title="文件分享" name="4">
            <div>
              因为总不能当谁拿到文件路径之后能到处下载，所以这里需要用到文件分享功能。获取到的分享链接有一天的有效期，超过时间后 将无法下载
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card class="content-card" shadow="hover">
        <div class="user-container">
          <svg-icon icon-class="github" class-name="author-info"></svg-icon>
        </div>
        <div class="user-container">
          <div><a href="https://github.com/guriytan/airbox" target="_blank">Guriytan</a></div>
          <a href="http://www.guriytan.cn" target="_blank">个人博客</a>
        </div>
      </el-card>
    </el-col>
  </div>
</template>

<script>
  export default {
    name: "Help",
    data() {
      return {
        activeNames: ['1']
      };
    }
  }
</script>

<style lang="scss" scoped>
  .help-container {
    width: 90%;
    margin: auto;

    .title-card {
      margin-bottom: 20px;

      .title-icon {
        width: 20px;
        height: 20px;
        margin-right: 10px;
      }

      .title-header {
        font-size: 20px;
        font-weight: bold;
      }
    }

    .content-card {
      margin-right: 30px;

      .content-title {
        font-size: 12px;
        margin-bottom: 20px;
      }

      .user-container {
        margin: 10% auto;
        text-align: center;
        border-radius: 15px;
        -webkit-box-shadow: 0 20px 50px 0 #3b2d9f;

        .author-info {
          width: 20vh;
          height: 20vh;
          margin-bottom: 20px;
        }

        div {
          margin-bottom: 15px;

          a {
            font-size: 20px;
          }
        }

        a {
          font-size: 15px;
        }
      }
    }
  }
</style>
