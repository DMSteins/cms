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

@connect(()=>({

}))
@Form.create()
export default class AddTenant extends PureComponent {
  agentId = "";
  componentDidMount(){
    const userData = getLocalStorage('KCureentUserData');
    if(userData) this.agentId = userData.id ? userData.id : '';
  }
  addResult = (response)=>{
    if(response){
        message.success('新建客户成功');
    }else{
        message.error('新建客户失败');
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'tenant/addTenant',
          payload: {
            ...values,
            expires: values['expires'].format('YYYY-MM-DD HH:mm:ss'),
            agentId: this.agentId,
            },
          callback: this.addResult,
        });
      }
    });
  };

  render() {
    const { submitting, form } = this.props;
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
        title="新增客户"
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

              })(<Input placeholder="客户名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="描述">
              {getFieldDecorator('description',{
              })(
                <TextArea
                  style={{ minHeight: 32 }}
                  placeholder="客户描述"
                  rows={4}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="地区">
              {getFieldDecorator('region')(
                <Input placeholder="客户地区"/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="详细地址">
              {getFieldDecorator('location')(
                <Input placeholder="客户详细地址"/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="联系人">
              {getFieldDecorator('contact')(
                <Input placeholder="客户联系人称呼"/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="手机号">
              {getFieldDecorator('phone')(
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
                  initialValue: 100,
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
