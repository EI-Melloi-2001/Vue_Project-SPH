<template>
  <!-- 商品分类导航 -->
  <div class="type-nav">
    <div class="container">
      <!-- 事件委派|事件委托 -->
      <div @mouseleave="leaveShow" @mouseenter="enterShow">
        <h2 class="all">全部商品分类</h2>
        <!-- 过渡动画 -->
        <transition name="sort">
          <!-- 三级联动 -->
          <div class="sort" v-show="show">
            <!-- 利用事件的委派+编程式导航实现路由的跳转与传参 -->
            <div class="all-sort-list2" @click="goSearch">
              <div
                class="item"
                v-for="(c1, index) in categoryList"
                :key="c1.categoryId"
                :class="{ cur: currentIndex == index }"
              >
                <h3 @mouseenter="changeIndex(index)">
                  <a
                    :data-categoryName="c1.categoryName"
                    :data-categoryId="c1.category1Id"
                    >{{ c1.categoryName }}</a
                  >
                  <!-- <router-link to="/search">{{ c1.categoryName }}</router-link> -->
                </h3>
                <!-- 二级、三级分类 -->
                <div
                  class="item-list clearfix"
                  :style="{ display: currentIndex == index ? 'block' : 'none' }"
                >
                  <div
                    class="subitem"
                    v-for="(c2, index) in c1.categoryChild"
                    :key="c2.categoryId"
                  >
                    <dl class="fore">
                      <dt>
                        <a
                          :data-categoryName="c2.categoryName"
                          :data-category2Id="c2.categoryId"
                          >{{ c2.categoryName }}</a
                        >
                        <!-- <router-link to="/search">{{ c2.categoryName }}</router-link> -->
                      </dt>
                      <dd>
                        <em
                          v-for="(c3, index) in c2.categoryChild"
                          :key="c3.categoryId"
                        >
                          <a
                            :data-categoryName="c3.categoryName"
                            :data-category3Id="c3.categoryId"
                            >{{ c3.categoryName }}</a
                          >
                          <!-- <router-link to="/search">{{ c3.categoryName }}</router-link> -->
                        </em>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">尚品汇超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
//防抖与节流：引入lodash（是把lodash全部功能函数引入）
// import _ from "lodash";
//最好的引入方式：按需加载（优化手段）
import throttle from "lodash/throttle";
export default {
  name: "TypeNav",
  data() {
    return {
      //存储用户鼠标移动至哪一个一级分类
      currentIndex: -1,
      show: true,
    };
  },
  //组件挂载完毕：可以向服务器发请求
  mounted() {
    //当组件挂载完毕，让show属性值变为false
    //如果不是Home路由组件，将typeNav进行隐藏
    if (this.$route.path != "/home") {
      this.show = false;
    }
    console.log("TyNav挂载完毕！");
  },
  computed: {
    ...mapState({
      /**
       * 右侧需要一个函数，当使用计算属性时，右侧函数会立即执行一次
       * 注入一个参数state，其实即为大仓库中的数据
       */
      categoryList: (state) => state.home.categoryList,
      // console.log(state);
    }),
  },
  methods: {
    //鼠标进入修改响应式数据currentIndex属性
    //throttle回调函数别用箭头函数，可能出现上下文this问题。
    changeIndex: throttle(function (index) {
      //index：鼠标移动至某一个一级分类的元素的索引值。
      /* 正常情况（用户缓慢的操作）：鼠标进入，每一个一级分类h3，都会触发鼠标进入事件。
      非正常情况（用户操作很快）：理应全部的一级分类h3都应该触发鼠标进入事件，但是经过测试只有部分的h3触发了。
      就是由于用户的行为过快，导致浏览器“反应不过来”，如果当前的回调函数中有大量业务，有可能出现“卡顿”现象。 */
      this.currentIndex = index;
    }, 20),
    //一级分类鼠标移出的事件回调
    leaveShow() {
      //鼠标移出时currentIndex变为-1
      this.currentIndex = -1;
      //判断如果是Search路由组件的时候才会执行
      if (this.$route.path != "/home") {
        //鼠标移出时，让商品分类列表进行展示。
        this.show = false;
      }
    },
    //进行路由跳转的方法
    goSearch(event) {
      /* 最好的解决方案：利用编程式导航 + 事件委派
      利用事件委派存在一些问题：
      1、事件委派的本质是把全部的子节点[h3、dt、dl、em]的事件委派给父亲节点
         点击a标签的时候才会进行路由跳转。怎么能够确定点击的一定是a标签？
      2、即使确定了点击的是a标签，如何确定点击的是一级（或者二级、三级）分类的a标签？
      3、如何获取参数？[1、2、3及分类产品的名字、id] */

      /* 问题1的解决方案：在子节点中的a标签里，添加自定义属性data-categoryName，其余子节点不设置。*/

      //通过event.target方法获取到当前出发这个事件的元素[h3、a、dt、dl]，全部的标签元素中只有a标签带有自定义属性data-categoryname。
      let node = event.target;

      //节点自带一个属性dataset，可以获取节点的自定义属性与属性值。
      let { categoryname, category1id, category2id, category3id } =
        node.dataset;
      //只要标签身上拥有categoryname属性，它一定是a标签
      if (categoryname) { //一定是a标签才能够进入
        /* 
        问题3：如何获取参数？[1、2、3及分类产品的名字、id]
        解决方案如下
         */
        //整理、准备路由跳转的参数对象
        let location = { name: "search" };
        let query = { categoryName: categoryname };
        /* 
        问题2：一级分类、二级分类、三级分类的a标签如何确定？
        解决方案：
        在子节点的a标签里，添加自定义属性data-category1Id、 data-category2Id、data-category3Id
        用于区别一级分类、耳机分类、三级分类的a标签
        */
        if (category1id) { //一定是对应一级目录的a标签
          query.category1Id = category1id;
        } else if (category2id) { //一定是对应二级目录的a标签
          query.category2Id = category2id;
        } else { //一定是对应三级目录的a标签
          query.category3Id = category3id;
        }
        //判断：如果路由跳转的时候带有params参数，捎带一并传递过去。
        if(this.$route.params){
          //动态给location配置对象添加params参数
          location.params = this.$route.params;
          //动态给location配置对象添加query属性
          location.query = query;
          //路由跳转
          this.$router.push(location);
        }
      }
      // this.$router.push("/search");
    },
    //当鼠标移入时，让商品分类列表进行展示。
    enterShow() {
      if (this.$route.path != "/home") {
        this.show = true;
      }
    },
  },
};
</script>

<style scoperd lang="less">
.type-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;
      position: absolute;
      background: #fafafa;
      z-index: 999;

      .all-sort-list2 {
        .item {
          h3 {
            line-height: 30px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;

            a {
              color: #333;
            }
          }

          .item-list {
            display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }

          &:hover {
            .item-list {
              display: block;
            }
          }
        }
        .cur {
          background-color: skyblue;
        }
      }
    }
    //过渡（transition）动画的样式
    //过渡动画开始状态（进入开始）
    .sort-enter,
    .sort-leave-to {
      height: 0px;
    }
    //过渡动画结束状态（进入结束）
    .sort-enter-to,
    .sort-leave {
      height: 461px;
    }
    //定义动画时间、速率
    .sort-enter-active,
    .sort-leave-active {
      transition: all 0.5s;
    }
  }
}
</style>