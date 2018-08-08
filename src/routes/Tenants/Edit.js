import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
  message,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getLocalStorage } from '../../utils/help';
import { Router } from '../../../node_modules/dva/router';
// import styles from '../Products/style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ tenant })=>({
  currentTenant: tenant.currentTenant,
}))
@Form.create()
export default class EditTenant extends PureComponent {
  agentId = "";
  componentDidMount(){
    const { dispatch } = this.props;
    dispatch({
      type: 'tenant/detailTenant',
      payload: {
        id: this.props.match.params.id,
      }
    });
  }
  addResult = (response)=>{
    /** 由于修改信息，后台不返回结果，所以直接显示成功*/
    // if(response){
        message.success('修改客户信息成功');
    // }else{
    //     message.error('修改客户信息失败');
    // }
  }

  handleSubmit = e => {
    console.log(111);
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'tenant/edit',
          payload: {
            ...values,
            expires: values['expires'].format('YYYY-MM-DD HH:mm:ss'),
            id: this.props.match.params.id,
            },
          callback: this.addResult,
        });
      }else{
        console.log(err);
      }
    });
  };

  render() {
    const { submitting, form, currentTenant } = this.props;
    const { getFieldDecorator } = form;

    function disabledDate(current) {
        // Can not select days before today and today
        return current && current < moment().endOf('day');
      }

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <PageHeaderLayout
        title="编辑客户信息"
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '客户名称不可为空',
                  },
                ],
                initialValue: currentTenant.name ? currentTenant.name : "",
              })(<Input placeholder="客户名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="描述">
              {getFieldDecorator('description',{
                initialValue: currentTenant.description ? currentTenant.description : "",
              })(
                <TextArea
                  style={{ minHeight: 32 }}
                  placeholder="客户描述"
                  rows={4}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="地区">
              {getFieldDecorator('region', {
                initialValue: currentTenant.region ? currentTenant.region : "",
              })(
                <Input placeholder="客户地区"/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="详细地址">
              {getFieldDecorator('location', {
                initialValue: currentTenant.location ? currentTenant.location : "",
              })(
                <Input placeholder="客户详细地址"/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="联系人">
              {getFieldDecorator('contact', {
                initialValue: currentTenant.contact ? currentTenant.contact : "",
              })(
                <Input placeholder="客户联系人称呼"/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="手机号">
              {getFieldDecorator('phone', {
                initialValue: currentTenant.phone ? currentTenant.phone : "",
              })(
                <Input placeholder="客户手机号"/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="到期时间">
              {getFieldDecorator('expires',{
                rules: [
                  {
                    required: true,
                    message: '到期时间不可为空',
                  },
                ],
                /**由于时区问题多加一层moment转换 */
                initialValue:  moment(moment(currentTenant.expires).format('YYYY-MM-DD HH:mm:ss')) ,
              })(
                <DatePicker
                format="YYYY-MM-DD HH:mm:ss"
                disabledDate={disabledDate}
                placeholder="到期时间"
                showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
              />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="上限数量">
              {getFieldDecorator('limit',{
                  initialValue: currentTenant.limit ? currentTenant.limit : "",
              })(
                <InputNumber min={0} placeholder="上限数量"/>
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                保存
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
