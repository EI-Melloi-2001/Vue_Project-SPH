<template>
  <!--列表-->
  <div class="list-container">
    <div class="sortList clearfix">
      <div class="center">
        <!--banner轮播-->
        <Carousel :list="bannerList"/>
      </div>

      <div class="right">
        <div class="news">
          <h4>
            <em class="fl">尚品汇快报</em>
            <span class="fr tip">更多 ></span>
          </h4>
          <div class="clearix"></div>
          <ul class="news-list unstyled">
            <li><span class="bold">[特惠]</span>备战开学季 全民半价购数码</li>
            <li><span class="bold">[公告]</span>备战开学季 全民半价购数码</li>
            <li><span class="bold">[特惠]</span>备战开学季 全民半价购数码</li>
            <li><span class="bold">[公告]</span>备战开学季 全民半价购数码</li>
            <li><span class="bold">[特惠]</span>备战开学季 全民半价购数码</li>
          </ul>
        </div>
        <ul class="lifeservices">
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">话费</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">机票</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">电影票</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">游戏</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">彩票</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">加油站</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">酒店</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">火车票</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">众筹</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">理财</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">礼品卡</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">白条</span>
          </li>
        </ul>
        <div class="ads">
          <img src="./images/ad1.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "ListContainer",
  //mounted：组件挂载完毕，正常说组件的结构（DOM）已经全有了
  //为什么swiper实例在mounted当中不可以直接书写：因为结构（DOM）还没有完整。
  mounted() {
    /* //模拟
    console.log("---mounted---"); */

    //派发action：通知vuex发起ajax数据请求，将返回数据存储在仓库store当中。
    this.$store.dispatch("getBannerList");

    /* 在new Swiper实例之前，页面中结构必须得有[现在把new Swper实例放在mounted这里不行]
    原因：dispatch当中涉及到异步语句，导致v-for遍历的时候结构还不完整。因此不行。 */

    //解决方案1：设置计数器（可以实现但是不推荐）
    //#region
    /* setTimeout(() => {
      var mySwiper = new Swiper(document.querySelector(".swiper-container"), {
        loop: true, // 循环模式选项

        // 如果需要分页器
        pagination: {
          el: ".swiper-pagination",
          //点击小球时也可以切换图片
          clickable: true,
        },

        // 如果需要前进后退按钮
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });
    }, 2000); */
    //#endregion
  },
  computed: {
    ...mapState({
      bannerList: (state) => state.home.bannerList,
    }),
  },
  //#region
  // //解决方案2（最优解）：watch监视 + $nextTick()
  // // watch:监听已有数据的变化
  // watch: {
  //   //监听bannerList数据的变化，因为这条数据发生过变化（由空数组变为数组当中存有4个元素）
  //   bannerList: {
  //     immediate: true, ////初始化时调用一下handler
  //     deep: true, //开启深度监听
  //     handler(newValue, oldValue) {
  //       /* 现在咱们通过watch监听bannerList属性的属性值的变化
  //       如果执行handler方法，代表组件实例身上这个属性的属性值已经有了[数组对象：四个元素]
  //       当前handler函数执行，只能够保证bannerList上已经有数据了，但是没办法保证v-for已经执行结束（遍历也需要时间）。
  //       v-for执行完毕，才有DOM结构[现在在watch当中是没有办法保证的] */

  //       /* nextTick：在下次DOM更新 循环结束之后 执行延迟回调。
  //       在 修改数据之后 立即使用这个方法，获取更新后的 DOM。*/
  //       this.$nextTick(() => {
  //         //当执行这个回调的时候：保证服务器数据回来了，v-for执行完毕了。[此时轮播图的结构一定有了]
  //         var mySwiper = new Swiper(
  //           // document.querySelector(".swiper-container"),//传统对DOM操作
  //           this.$refs.mySwiper,
  //           {
  //             loop: true, // 循环模式选项
  //             autoplay: true, //开启自动放映

  //             // 如果需要分页器
  //             pagination: {
  //               el: ".swiper-pagination",
  //               //点击小球时也可以切换图片
  //               clickable: true,
  //             },

  //             // 如果需要前进后退按钮
  //             navigation: {
  //               nextEl: ".swiper-button-next",
  //               prevEl: ".swiper-button-prev",
  //             },
  //           }
  //         );
  //       });
  //     },
  //   },
  // },
  //#endregion
};
</script>

<style scoped lang="less">
.list-container {
  width: 1200px;
  margin: 0 auto;

  .sortList {
    height: 464px;
    padding-left: 210px;

    .center {
      box-sizing: border-box;
      width: 740px;
      height: 100%;
      padding: 5px;
      float: left;
    }

    .right {
      float: left;
      width: 250px;

      .news {
        border: 1px solid #e4e4e4;
        margin-top: 5px;

        h4 {
          border-bottom: 1px solid #e4e4e4;
          padding: 5px 10px;
          margin: 5px 5px 0;
          line-height: 22px;
          overflow: hidden;
          font-size: 14px;

          .fl {
            float: left;
          }

          .fr {
            float: right;
            font-size: 12px;
            font-weight: 400;
          }
        }

        .news-list {
          padding: 5px 15px;
          line-height: 26px;

          .bold {
            font-weight: 700;
          }
        }
      }

      .lifeservices {
        border-right: 1px solid #e4e4e4;
        overflow: hidden;
        display: flex;
        flex-wrap: wrap;

        .life-item {
          border-left: 1px solid #e4e4e4;
          border-bottom: 1px solid #e4e4e4;
          margin-right: -1px;
          height: 64px;
          text-align: center;
          position: relative;
          cursor: pointer;
          width: 25%;

          .list-item {
            background-image: url(~@/assets/images/icons.png);
            width: 61px;
            height: 40px;
            display: block;
          }

          .service-intro {
            line-height: 22px;
            width: 60px;
            display: block;
          }

          &:nth-child(1) {
            .list-item {
              background-position: 0px -5px;
            }
          }

          &:nth-child(2) {
            .list-item {
              background-position: -62px -5px;
            }
          }

          &:nth-child(3) {
            .list-item {
              background-position: -126px -5px;
            }
          }

          &:nth-child(4) {
            .list-item {
              background-position: -190px -5px;
            }
          }

          &:nth-child(5) {
            .list-item {
              background-position: 0px -76px;
            }
          }

          &:nth-child(6) {
            .list-item {
              background-position: -62px -76px;
            }
          }

          &:nth-child(7) {
            .list-item {
              background-position: -126px -76px;
            }
          }

          &:nth-child(8) {
            .list-item {
              background-position: -190px -76px;
            }
          }

          &:nth-child(9) {
            .list-item {
              background-position: 0px -146px;
            }
          }

          &:nth-child(10) {
            .list-item {
              background-position: -62px -146px;
            }
          }

          &:nth-child(11) {
            .list-item {
              background-position: -126px -146px;
            }
          }

          &:nth-child(12) {
            .list-item {
              background-position: -190px -146px;
            }
          }
        }
      }

      .ads {
        margin-top: 5px;

        img {
          opacity: 0.8;
          transition: all 400ms;

          &:hover {
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>