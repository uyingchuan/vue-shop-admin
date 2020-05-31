<template>
  <el-container>
    <!-- 左侧边栏区域 -->
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <!-- 左侧边菜单栏 --><!-- collapse-transition="false" 意为关闭折叠动画效果 -->
      <el-menu background-color="#293846" text-color="#fff" active-text-color="#ffd04b" unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="currentPath">
        <!-- 一级菜单 -->
        <el-submenu :index="item.path" v-for="item in menuList" :key="item.id">
          <!-- 一级菜单模板区域 -->
          <template slot="title">
            <i :class="iconsObj[item.id]"></i>
            <span>{{ item.authName }}</span>
          </template>
          <!-- 二级菜单 -->
          <el-menu-item :index="subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState(subItem.path)">
            <!-- 二级菜单模板区域 -->
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{ subItem.authName }}</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>

    <!-- 右边主体区域 -->
    <el-container>
      <!-- 右边头部区域 -->
      <el-header>
        <el-button size="mini" type="success" icon="el-icon-s-fold" @click="toggleCollapse"></el-button>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>

      <!-- 右边内容区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false,
      menuList: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      currentPath: ''
    }
  },
  created() {
    this.getMenuList()
    this.currentPath = window.sessionStorage.getItem('currentPath')
  },
  methods: {
    // 退出登录功能
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 折叠侧边栏功能
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 获取侧边导航栏列表数据
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    // 保存链接激活状态
    saveNavState(currentPath) {
      window.sessionStorage.setItem('currentPath', currentPath)
      this.currentPath = currentPath
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
}
.el-aside {
  background: #2f4050;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background: #ffffff;
}
.iconfont {
  margin-right: 8px;
}
</style>
