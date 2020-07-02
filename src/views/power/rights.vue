<template>
  <div class="">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-table :data="rights" border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column label="权限等级">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level === '0'" @click="test(scope)">等级一</el-tag>
            <el-tag v-if="scope.row.level === '1'" type="success">等级二</el-tag>
            <el-tag v-if="scope.row.level === '2'" type="danger">等级三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 储存权限列表
      rights: []
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    // 获取权限列表
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.rights = res.data
      this.$message.success('获取权限列表成功')
    },
    test(scope) {
      console.log(scope, this.rights)
    }
  }
}
</script>
<style lang="less" scoped></style>
