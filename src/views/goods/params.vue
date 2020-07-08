<template>
  <div class="">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 警告区域 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类： </span>
          <el-cascader
            v-model="selectCateKeys"
            :options="cateList"
            :props="treeProps"
            @change="handleChange"
            clearable
          >
          </el-cascader>
        </el-col>
      </el-row>

      <!-- tab 页签区域 -->
      <el-row>
        <el-col>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <!-- 动态参数区域 -->
            <el-tab-pane label="动态参数" name="many">
              <el-button
                type="primary"
                size="mini"
                :disabled="isBtnDisabled"
                @click="addDialogVisible = true"
                >添加参数</el-button
              >
              <!-- 动态参数表格 -->
              <el-table :data="manyTableData" border stripe>
                <el-table-column type="expand">
                  <template v-slot="scope">
                    <el-tag
                      v-for="(item, index) in scope.row.attr_vals"
                      :key="index"
                      closable
                      @close="handleTagClose(scope.row, index)"
                      >{{ item }}</el-tag
                    >

                    <el-input
                      class="input-new-tag"
                      style="width: 120px"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>

                    <el-button
                      v-else
                      class="button-new-tag"
                      size="small"
                      @click="showInput(scope.row)"
                      >+ New Tag</el-button
                    >
                  </template>
                </el-table-column>

                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="attr_name" label="参数名"></el-table-column>

                <el-table-column label="操作" width="180px">
                  <template slot-scope="scope">
                    <el-button
                      type="primary"
                      icon="el-icon-edit"
                      size="mini"
                      @click="editDiglogInit(scope.row.attr_id)"
                      >编辑</el-button
                    >
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      @click="deleteParamsById(scope.row.attr_id)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <!-- 静态属性区域 -->
            <el-tab-pane label="静态属性" name="only">
              <el-button
                type="primary"
                size="mini"
                :disabled="isBtnDisabled"
                @click="addDialogVisible = true"
                >添加属性</el-button
              >
              <!-- 静态属性表格 -->
              <el-table :data="onlyTableData" border stripe>
                <el-table-column type="expand">
                  <template v-slot="scope">
                    <el-tag
                      v-for="(item, index) in scope.row.attr_vals"
                      :key="index"
                      closable
                      @close="handleTagClose(scope.row, index)"
                      >{{ item }}</el-tag
                    >

                    <el-input
                      class="input-new-tag"
                      style="width: 120px"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>

                    <el-button
                      v-else
                      class="button-new-tag"
                      size="small"
                      @click="showInput(scope.row)"
                      >+ New Tag</el-button
                    >
                  </template>
                </el-table-column>

                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="attr_name" label="属性名"></el-table-column>
                <el-table-column label="操作" width="180px">
                  <template v-slot="scope">
                    <el-button
                      type="primary"
                      icon="el-icon-edit"
                      size="mini"
                      @click="editDiglogInit(scope.row.attr_id)"
                      >编辑</el-button
                    >
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      @click="deleteParamsById(scope.row.attr_id)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + getTitleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="getTitleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <button @click="addDialogVisible = false">取消</button>
        <button @click="addParams" type="primary">确定</button>
      </span>
    </el-dialog>

    <!-- 编辑参数对话框 -->
    <el-dialog
      :title="'修改' + getTitleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="getTitleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <button @click="editDialogVisible = false">取 消</button>
        <button @click="editParams" type="primary">确 定</button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectCateKeys: [],
      cateList: [],
      treeProps: {
        expandTrigger: 'hover',
        checkStrictly: false,
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      activeName: 'many',

      manyTableData: [],
      onlyTableData: [],

      addDialogVisible: false,
      editDialogVisible: false,

      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      },
      editForm: {},
      editFormRules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      }
    }
  },

  created() {
    this.getCateList()
  },

  computed: {
    // 按钮禁用指标
    isBtnDisabled() {
      return this.selectCateKeys.length !== 3
    },
    // 当前项商品id
    cateId() {
      if (this.selectCateKeys.length === 3) {
        return this.selectCateKeys[this.selectCateKeys.length - 1]
      }
      return null
    },
    // 当前 dialog 框主题
    getTitleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态参数'
      }
    }
  },

  methods: {
    // 获取所有商品数据列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 3 }
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取商品数据失败！')
      }

      this.cateList = res.data
    },
    // 级联选择框 数据改变 触发事件
    handleChange() {
      this.getParamsData()
    },
    // Tab 页签点击事件
    handleClick() {
      this.getParamsData()
    },
    // 获取参数列表数据
    async getParamsData() {
      // 限定三级分类
      if (this.selectCateKeys.length !== 3) {
        this.selectCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: { sel: this.activeName }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类参数列表失败')
      }
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 参数编辑
    async editDiglogInit(id) {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`, {
        params: { attr_sel: this.activeName }
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 参数删除
    async deleteParamsById(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该参数，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancekButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除操作！')
      }
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除参数失败！')
      }
      this.$message.success('删除参数成功！')
      this.getParamsData()
    },
    // 文本框 失焦 或者 enter 出触发事件
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    // 上传对 参数 的修改
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      return this.$message.success('修改参数项成功')
    },
    // tag 标签关闭事件（删除当前参数）
    handleTagClose(row, index) {
      row.attr_vals.splice(index, 1)
      this.saveAttrVals(row)
    },
    // 打开输入框（添加新参数属性）
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 添加参数
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return false
        }
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success('添加参数成功！')
        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    // 编辑参数
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return false
        }
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success('修改参数成功！')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    // 关闭 添加参数 对话框
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 关闭 编辑参数 对话框
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    }
  }
}
</script>
<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-cascader {
  width: 25%;
}
.el-tag {
  margin: 8px;
}
.input-new-tag {
  width: 90px;
}
.button-new-tag {
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
