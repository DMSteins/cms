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
import DescriptionList from 'components/DescriptionList';
import { getLocalStorage } from '../../utils/help';
import { Router } from '../../../node_modules/dva/router';
// import styles from '../Products/style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Description } = DescriptionList;

@connect(()=>({

}))
@Form.create()
export default class DetailTenant extends PureComponent {

  componentDidMount(){
    console.log(this.props.match.params.id);
  }

  render() {
    const { submitting, form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <PageHeaderLayout
        title="客户详情"
      >
        <Card bordered={false}>
        <DescriptionList size="large" title="退款申请" style={{ marginBottom: 32 }}>
            <Description term="取货单号">1000000000</Description>
            <Description term="状态">已取货</Description>
            <Description term="销售单号">1234123421</Description>
            <Description term="子订单">3214321432</Description>
          </DescriptionList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
