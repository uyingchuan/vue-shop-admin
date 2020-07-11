<template>
  <div class="">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-button type="primary" @click="addDiglogVisible = true">添加角色</el-button>

      <el-table row-key="id" :data="roles" border stripe>
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              v-for="(item0, index0) in scope.row.children"
              :key="item0.id"
              :class="['bdbottom', index0 === 0 ? 'bdtop' : '', 'vcenter']"
            >
              <!-- 一级标签 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightsById(scope.row, item2.id)">{{ item0.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级标签与三级标签 -->
              <el-col :span="19">
                <el-row
                  v-for="(item1, index1) in item0.children"
                  :key="item1.id"
                  :class="[index1 === 0 ? '' : 'bdtop', 'vcenter']"
                >
                  <!-- 二级标签 -->
                  <el-col :span="6">
                    <el-tag closable type="success" @close="removeRightsById(scope.row, item1.id)">{{ item1.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级标签 -->
                  <el-col :span="18">
                    <el-tag closable type="warning" v-for="item2 in item1.children" :key="item2.id" @close="removeRightsById(scope.row, item2.id)">{{ item2.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引 -->
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="eidtDiglogInit(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRoleById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightsDiglog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加角色 diglog -->
      <el-dialog title="添加角色" :visible.sync="addDiglogVisible" @close="diglogClose('add')">
        <el-form :model="addForm" :rules="formRules" ref="addFormRef" label-width="80px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDiglogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRole">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑角色 diglog -->
      <el-dialog title="修改角色" :visible.sync="editDiglogVisible" @close="diglogClose('edit')">
        <el-form :model="editForm" :rules="formRules" ref="editFormRef" label-width="80px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDiglogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRoleInfo">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 分配权限 diglog -->
      <el-dialog
        title="修改角色"
        :visible.sync="setRightsDiglogVisible"
        @close="setRightsDiglogClose('edit')"
      >
        <el-tree
          :data="rights"
          show-checkbox
          node-key="id"
          :default-expanded-keys="defkeys"
          :default-checked-keys="defkeys"
          :props="treeProps"
          ref="treeRef"
        >
        </el-tree>
        <div slot="footer" class="dialog-footer">
          <el-button @click="setRightsDiglogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色列表数据
      roles: [],
      // 角色数据
      editForm: {},
      // 添加角色数据
      addForm: {},
      // 默认展开的节点的 KEY 的数组（拥有权限的展开并勾选，没有的不展开。存储有权限的节点 id）
      defkeys: [],
      // 所有角色权限列表
      rights: [],
      // 绑定节点属性值
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 控制添加角色对话框显隐
      addDiglogVisible: false,
      // 控制编辑角色对话框显隐
      editDiglogVisible: false,
      // 控制分配权限对话框显隐
      setRightsDiglogVisible: false,
      // 表单验证
      formRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getRoles()
  },
  methods: {
    // 获取角色列表数据
    async getRoles() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200 && res.meta.status !== 201) {
        return this.$message.error(res.meta.msg)
      }
      this.roles = res.data
      this.$message.success('获取角色列表成功')
    },
    // 关闭 diglog 事件（初始化 diglog）
    diglogClose(operation) {
      if (operation === 'add') {
        this.$refs.addFormRef.resetFields()
      } else if (operation === 'edit') {
        this.$refs.editFormRef.resetFields()
      }
    },
    // 关闭权限分配 diglog 事件
    setRightsDiglogClose() {
      this.defkeys = []
    },
    // 操作区编辑按钮功能
    eidtDiglogInit(roleInfo) {
      this.editForm = JSON.parse(JSON.stringify(roleInfo))
      this.editDiglogVisible = true
    },
    // 操作区分配权限按钮功能
    async showSetRightsDiglog(role) {
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.rights = res.data
      this.roleId = role.id
      this.getLeafRights(role, this.defkeys)
      this.setRightsDiglogVisible = true
    },
    // 获取权限列表 id 分布（）
    getLeafRights(node, arr) {
      if (!node.children) {
        arr.push(node.id)
      } else {
        node.children.forEach(element => {
          this.getLeafRights(element, arr)
        })
      }
    },
    // 分配权限功能
    async allotRights() {
      // 获取当前被选中与半选中的节点的key所组成的数组
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: keys.join(',')
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('分配权限成功')
      this.setRightsDiglogVisible = false
      this.getRoles()
    },
    // 操作区删除按钮功能（删除角色功能）
    async deleteRoleById(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`roles/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('删除角色成功')
      this.getRoles()
    },
    // 添加角色功能
    addRole() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addForm)
        if (res.meta.status !== 200 && res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$refs.addFormRef.resetFields()
        this.addDiglogVisible = false
        this.$message.success('添加角色成功')
        this.getRoles()
      })
    },
    // 修改用户数据功能
    editRoleInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`roles/${this.editForm.id}`, {
          roleName: this.editForm.roleName,
          roleDesc: this.editForm.roleDesc
        })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$refs.editFormRef.resetFields()
        this.editDiglogVisible = false
        this.$message.success('修改成功')
        this.getRoles()
      })
    },
    // 标签关闭事件（删除权限）
    async removeRightsById(role, rightsId) {
      // 最后提示
      const confirmResult = await this.$confirm('此操作将永久删除该权限，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'wraning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      // 删除权限
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightsId}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('权限删除成功')
      // 重新渲染标签数据（不重新渲染整个 table ）
      role.children = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 2px solid #eeeeee;
}
.bdbottom {
  border-bottom: 2px solid #eeeeee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
