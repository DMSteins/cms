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

@connect(({ tenant, product, subscriptions })=>({
    currentTenant: tenant.currentTenant,
    product: product.list,
    subsList: subscriptions.data,
    currentSubscription: subscriptions.currentSubscription,
}))
@Form.create()
export default class EditSubscription extends PureComponent {

  componentDidMount(){
    this.fetchTenantInfo();
    this.fetchAllSubscription();
    this.fetchProductData();
    this.fetchSubscription();
  }

  fetchSubscription = ()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'subscriptions/getSubscription',
      payload: {
        id: this.props.match.params.s_id,
      },
    });
  }

  fetchAllSubscription = (p = 1)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'subscriptions/fetchList',
      payload: {
        page: p,
        page_size: 10,
        tenant_id: this.props.match.params.t_id,
      },
    });
  }

  fetchTenantInfo = ()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'tenant/detailTenant',
      payload: {
        id: this.props.match.params.t_id,
      },
    });
  }

  fetchTenantData = (p = 1)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'tenant/fetchList',
      payload: {
        page: p,
        page_size: 10,
      },
    });
  }

  fetchProductData = (p = 1)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'product/fetch',
      payload: {
        page: p,
        page_size: 10,
      },
    });
  }

  addResult = (response)=>{
    // if(response){
        message.success('修改订阅成功');
    // }else{
    //     message.error('修改订阅失败');
    // }
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {

      if (!err) {
        dispatch({
          type: 'subscriptions/updateSubscription',
          payload: {
            ...values,
            expires: values['expires'].format('YYYY-MM-DD HH:mm:ss'),
            tenantId: this.props.match.params.t_id,
            id: this.props.match.params.s_id,
            },
          callback: this.addResult,
        });
      }
    });
  };

  render() {
    const { submitting, form, currentTenant, product, subsList, currentSubscription } = this.props;
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

    // let rowdata = [];
    // if(tenant.rows){
    //     rowdata = tenant.rows;
    // }
    // const options = rowdata.map(d => <Option key={d.id}>{d.name}</Option>);
    let subsArr = [];
    if(subsList.rows){
      subsList.rows.map(item => {
        subsArr.push(item.productionId);
      });
    }

    let proRowdata = [];
    if(product.rows){
      proRowdata = product.rows;
    }
    const proOptions = proRowdata.map(d => <Option key={d.id} disabled={subsArr.includes(d.id)}>{d.name}</Option>);

    return (
      <PageHeaderLayout
        title="修改订阅"
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="订阅客户名称">
              {getFieldDecorator('tenantName', {
                rules: [
                  {
                    required: true,
                    message: '客户名称不可为空',
                  },
                ],
                initialValue: currentTenant.name ? currentTenant.name : "",
              })(
                <Input placeholder="客户名称" disabled={true} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="订阅产品名称">
              {getFieldDecorator('productionId',{
                  initialValue:  currentSubscription.productionId,
              })(
                <Select
                showSearch
                // value={tenant.rows}
                placeholder={this.props.placeholder}
                style={this.props.style}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                // onSearch={this.handleSearch}
                // onChange={this.handleChange}
                notFoundContent={null}
              >
                {proOptions}
              </Select>
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
                initialValue:  moment(moment(currentSubscription.expires).format('YYYY-MM-DD HH:mm:ss')),
              })(
                <DatePicker
                format="YYYY-MM-DD HH:mm:ss"
                disabledDate={disabledDate}
                placeholder="到期时间"
                showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
              />
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                修改
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
