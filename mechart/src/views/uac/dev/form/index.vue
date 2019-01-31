<template>
  <div class="page-demo-form">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="文本" prop="text">
        <el-input v-model="ruleForm.text" clearable></el-input>
      </el-form-item>
      <el-form-item label="数字" prop="number">
        <el-input v-model.number="ruleForm.number" clearable></el-input>
      </el-form-item>

      <el-form-item label="复选框">
        <el-checkbox :indeterminate="ruleForm.isIndeterminate" v-model="ruleForm.checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="ruleForm.checkedCities" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="city in ruleForm.cities" :label="city" :key="city">{{city}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="单选框" prop="resource">
        <el-radio-group v-model="ruleForm.resource">
          <el-radio label="选择1"></el-radio>
          <el-radio label="选择2"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="手机号" prop="mobileNo" >
        <el-input size="small" clearable v-model="ruleForm.mobileNo" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <div style="display:flex; width: 100%;flex-wrap: wrap" >
      <base-single :baseClass="baseClass" :labelClass="labelClass" :valueClass="valueClass" placeholder="请输入司机姓名"
                   v-for="item in params" :key="item.label" :param="item" :data="data" :type="text" @change="handleChange"
      ></base-single>
    </div>

  </div>
</template>
<script>
  import maValidate from 'utils/common-method/validate/index';
  import BaseSingle from 'components/single/baseSingle';
  import {validateTips} from 'utils/tips';
  const cityOptions = ['上海', '北京', '广州', '深圳'];
  export default {
    components: {
      BaseSingle
    },
    data() {
      return {
        ruleForm: {
          text: '',
          number: '',
          resource: '',
          checkAll: false,
          checkedCities: ['上海', '北京'],
          cities: cityOptions,
          isIndeterminate: true,
          mobileNo: ''
        },
        rules: {
          text: [
            { required: true, message: validateTips.NOT_EMPTY, trigger: 'blur' },
            { min: 3, max: 5, message: validateTips.WORD_3_5, trigger: 'blur' }
          ],
          number: [
            { required: true, message: validateTips.NOT_EMPTY, trigger: 'blur' },
            { validator: maValidate.checkNum, trigger: 'blur' }
          ],
          resource: [
            { required: true, message: validateTips.NOT_EMPTY, trigger: 'change' }
          ],
          mobileNo: [
            { required: true, validator: maValidate.checkMobileNo, trigger: 'blur' }
          ]
        },
        params: [
          {
            type: 'text',
            label: '货主企业',
            delimiter: '：',
            key: 'ownerName'
          },
          {
            type: 'text',
            label: '联系人姓名',
            delimiter: '：',
            key: 'contractName'
          },
          {
            type: 'text',
            label: '联系人电话',
            delimiter: '：',
            key: 'contractMobile'
          },
          {
            type: 'text',
            label: '预计入库时间',
            delimiter: '：',
            key: 'instorePlanTime'
          },
          {
            type: 'text',
            label: '司机姓名',
            isInput: true,
            placeholder: '请输入司机姓名',
            delimiter: '：',
            key: 'driverName'
          },
          {
            type: 'text',
            label: '司机电话',
            delimiter: '：',
            key: 'driverMobile'
          }
        ],
        data: {
          ownerName: '永百川货运',
          contractName: '王大贵',
          contractMobile: '18318318318',
          instorePlanTime: '2018-9-27',
          driverName: '王大贵',
          driverMobile: '15819685274'
        },
        labelClass: ['label-class'],
        valueClass: ['value-class'],
        baseClass: ['base-single'],
        text: 'text'
      };
    },
    methods: {
      handleCheckAllChange(val) {
        this.ruleForm.checkedCities = val ? cityOptions : [];
        this.ruleForm.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.ruleForm.checkAll = checkedCount === this.ruleForm.cities.length;
        this.ruleForm.isIndeterminate = checkedCount > 0 && checkedCount < this.ruleForm.cities.length;
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            // console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      handleBlur(event) {
      },
      handleFocus(event) {
      },
      handleInput(event) {
      },
      handleChange(event) {
        this.data.driverName = event;
//        console.log(JSON.stringify(this.data));
      },
      emitChange(val) {

      }
    }
  };
</script>
<style >
  .demo-ruleForm{
    margin-top:20px;
    width:1000px;
  }
  .page-demo-form .base-single{
    width: 33.3%;
    height: 2.5rem;
    vertical-align:middle;
    display:flex;
  }
  .page-demo-form .label-class{
    width: 50%;
    height: 2.5rem;
    line-height: 2.5rem;
    vertical-align: middle;
    text-align: right;
  }
  .page-demo-form .value-class{
    width: 50%;
    height: 2.5rem;
    line-height: 2.5rem;
    vertical-align: middle;
    text-align: left;
  }
</style>
