import React, { PureComponent } from 'react';
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
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ product }) => ({
  currentPro: product.currentPro
}))
@Form.create()
export default class EditProduct extends PureComponent {
  
  componentDidMount(){
    const { dispatch } = this.props;
    dispatch({
      type: 'product/fetchProduct',
      payload: {
        id: this.props.match.params.id,
      },

    });
  }
  editResult = (response)=>{
    //服务器返回response为空，状态码202代表成功
    message.success("修改成功");

    //刷新数据
    const { dispatch } = this.props;
    dispatch({
      type: 'product/fetchProduct',
      payload: {
        id: this.props.match.params.id,
      },

    });
  }
  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'product/edit',
          payload: {id: this.props.match.params.id, ...values},
          callback: this.editResult,
        });
      }
    });
  };

  render() {
    const { submitting, form, currentPro } = this.props;
    const { getFieldDecorator, getFieldValue } = form;

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
        title="编辑产品"
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '产品名称不可为空',
                  },
                ],
                initialValue: currentPro.name ? currentPro.name : "",

              })(<Input placeholder="产品名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="描述">
              {getFieldDecorator('description',{
                initialValue: currentPro.description ? currentPro.description : "",
              })(
                <TextArea
                  style={{ minHeight: 32 }}
                  placeholder="产品描述"
                  rows={4}
                />
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                保存
              </Button>
              {/* <Button style={{ marginLeft: 8 }}>保存</Button> */}
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
