<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul
          class="cart-list"
          v-for="(cart, index) in cartInfoList"
          :key="cart.id"
        >
          <li class="cart-list-con1">
            <input
              type="checkbox"
              name="chk_list"
              :checked="cart.isChecked == 1"
              @change="updateCheckedById(cart, $event)"
            />
          </li>
          <li class="cart-list-con2">
            <img :src="cart.imgUrl" />
            <div class="item-msg">
              {{ cart.skuName }}
            </div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{ cart.skuPrice }}.00</span>
          </li>
          <li class="cart-list-con5">
            <a class="mins" @click="handler('minus', -1, cart)">-</a>
            <input
              autocomplete="off"
              type="text"
              minnum="1"
              class="itxt"
              :value="cart.skuNum"
              @change="handler('change', $event.target.value * 1, cart)"
            />
            <a class="plus" @click="handler('add', 1, cart)">+</a>
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{ cart.skuNum * cart.skuPrice }}</span>
          </li>
          <li class="cart-list-con7">
            <a class="sindelet" @click="deleteCartById(cart)">删除</a>
            <br />
            <a href="#none">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input
          class="chooseAll"
          type="checkbox"
          @change="updateAllCartChecked"
          :checked="isAllChecked && cartInfoList.length > 0"
        />
        <span>全选</span>
      </div>
      <div class="option">
        <a @click="deleteAllCheckedCart">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">
          已选择 <span>{{ cartInfoList.length }}</span
          >件商品
        </div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{ totalPrice }}</i>
        </div>
        <div class="sumbtn">
          <!-- 路由跳转:没有任何业务逻辑,声明式、编程式导航都可以 -->
          <router-link class="sum-btn" to="/trade">结算</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//按需引入lodash节流函数
import throttle from "lodash/throttle";
import { mapGetters } from "vuex";
export default {
  name: "ShopCart",
  //组件挂载完毕，获取购物车的数据
  mounted() {
    this.getData();
  },
  methods: {
    //获取购物车的数据请求函数
    getData() {
      this.$store.dispatch("getCartList");
    },
    //修改某一个产品的个数[加入节流]
    handler: throttle(async function (type, disNum, cart) {
      //type：为了区分这三个元素
      //disNum：+ 变化量为+1 - 变化量为-1 input 最终的个数（并不是变化量）
      //cart：点击的是哪一个产品（身上有id）
      //向服务器发请求，修改数量。
      switch (type) {
        case "add":
          disNum = 1;
          break;
        case "minus":
          //判断产品的个数大于1，才可以传递给服务器-1
          //如果出现产品个数小于等于1，传递服务器个数0（原封不动）
          disNum = cart.skuNum > 1 ? -1 : 0;
          break;
        case "change":
          //用户输入进来的最终量，如果是非法的（带有汉字|出现负数），则带给服务器数字0（原封不动）
          if (isNaN(disNum) || disNum < 1) {
            disNum = 0;
          } else {
            //属于正常的情况（小数则取整），带给服务器变化的量，用户输入进来的 - 产品的起始个数
            disNum = parseInt(disNum) - cart.skuNum;
          }
          /* disNum =
            isNaN(disNum) || disNum < 1 ? 0 : parseInt(disNum) - cart.skuNum; */
          break;
      }
      //派发action
      try {
        //代表的是修改成功
        await this.$store.dispatch("addOrUpdateShopCart", {
          skuId: cart.skuId,
          skuNum: disNum,
        });
        //再一次获取服务器最新的数据进行展示
        this.getData();
      } catch (error) {}
    }, 500),
    
    //删除某一个产品的操作
    async deleteCartById(cart) {
      //整理参数
      let skuId = cart.skuId;
      try {
        //如果删除成功，再次发送请求获取新数据进行展示
        await this.$store.dispatch("deleteCartListBySkuId", skuId);
        //再次获取购物车最新数据
        this.getData();
      } catch (error) {
        alert('删除失败！');
      }
    },
    
    //删除选中的产品
    //这个回调函数咱们没办法收集到一些有用的数据
    async deleteAllCheckedCart() {
      try {
        //派发一个action,等待勾选商品删除
        await this.$store.dispatch("deleteAllCheckedCart");
        //再发请求获取购物车列表
        this.getData();
      } catch (error) {
        alert('删除失败！原因：',error.message);
      }
    },

    //修改某个产品的勾选状态
    async updateCheckedById(cart,event) {
      //带给服务器的参数isChecked不是布尔值，应该是0|1
      try {
        //如果修改数据成功，再次获取服务器数据（购物车）
        let isChecked = event.target.checked ? "1" : "0";
        await this.$store.dispatch("updateCheckedById", {
          skuId: cart.skuId,
          isChecked,
        });
        this.getData();
      } catch (error) {
        //如果失败提示一下
        alert('修改失败!');
      }
    },

    //修改全部产品的选中状态
    async updateAllCartChecked(event) {
      let isChecked = event.target.checked ? "1" : "0";
      try {
        //派发action await等待成功：购物车全部商品勾选状态成功以后
        await this.$store.dispatch("updateAllCartIsChecked", isChecked);
        this.getData();
      } catch (error) {
        alert('修改失败!');
      }
    },
  },
  computed: {
    ...mapGetters(["CartInfo"]),
    //购物车数据
    cartInfoList() {
      return this.CartInfo.cartInfoList || [];
    },
    //计算购物车商品总价
    totalPrice() {
      let sum = 0;
      this.cartInfoList.forEach((item) => {
        sum += item.skuNum * item.skuPrice;
      });
      return sum;
    },
    //判断底部复选框是否勾选[全部产品都选中，才勾选]
    isAllChecked() {
      //遍历数组里面的元素，只要全部元素的isChecked属性都为1 返回true
      //只要有一个不是1 那么返回的就是false
      return this.cartInfoList.every((item) => item.isChecked == 1);
    },
  },
};
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      & > div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;
      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        & > li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        .cart-list-con4 {
          width: 10%;
        }

        .cart-list-con5 {
          width: 17%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          width: 10%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: "Microsoft YaHei";
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>