import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import {
  List,
  Card,
  Row,
  Col,
  Radio,
  Input,
  message,
  Button,
  Icon,
  Dropdown,
  Menu,
  Avatar,
  Popconfirm,
  Form,
  Modal,
} from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './List.less';
import { Link } from 'dva/router';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;
const FormItem = Form.Item;
/*连接model和component的数据，以model中的namespace为key作为model标识，然后将state的数据传递到props*/
@connect(({ product, loading }) => ({
  list: product,
  loading: loading.models.list,
}))

export default class ProductList extends PureComponent {
  state = {
    visible: false,
  };
  page = 1;
  componentDidMount() {
    this.fetchProductData();
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

  showModal = () => {
    this.setState({ visible: true });
  }

  handleCancel = () => {
    this.setState({ visible: false });
  }

  createResult= (params)=>{
    
    if(params){
      message.success('添加成功');
    }else{
      message.error('添加失败');
    }
    this.fetchProductData(this.page);

  }

  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
  
      const { dispatch } = this.props;
      dispatch({
        type: 'product/add',
        payload: {
          ...values
        },
        callback: this.createResult
      });

      form.resetFields();
      this.setState({
        visible: false,
      });
      
    });
  }

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }

  confirmDelete = (id)=>{
    const { dispatch } = this.props;
      dispatch({
        type: 'product/delete',
        payload: {
          id: id
        },
        callback: this.deleteProductResult
      });

  }
  deleteProductResult = (params)=>{
    
    message.success('删除成功');
    
    this.fetchProductData(this.page);
  }

  onChangePage = (page)=>{
    this.page = page;
    this.fetchProductData(page);
  }

  render() {
    const {
      list: {list},
      loading,
    } = this.props;
    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={() => ({})} />
      </div>
    );

    const paginationProps = {
      showQuickJumper: true,
      pageSize: 10,
      total: list.count > 0 ? list.count : 0,
      onChange: this.onChangePage,
    };

    const ListContent = ({ data: { owner, createdAt, percent, status } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>创建时间</span>
          <p>{moment(createdAt).format('YYYY-MM-DD HH:mm')}</p>
        </div>
      </div>
    );

    const MoreBtn = (item) => (
      <Dropdown overlay={
        (
          <Menu>
            <Menu.Item>
            <Popconfirm title="确定删除该产品吗？" onConfirm={()=>this.confirmDelete(item.id)} okText="确定" cancelText="取消">
            <a href="#">删除</a>
            </Popconfirm>
            </Menu.Item>
          </Menu>
        )
      }>
        <a>
          更多 <Icon type="down" />
        </a>
      </Dropdown>
    );

    return (
      <PageHeaderLayout>
        <div className={styles.standardList}>

          <Card
            className={styles.listCard}
            bordered={false}
            title=""
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <Button type="dashed" style={{ width: '100%', marginBottom: 8 }} icon="plus"
            onClick={this.showModal}
            >
              添加
            </Button>
            <List
              size="large"
              loading={loading}
              pagination={paginationProps}
              dataSource={list.rows}
              renderItem={item => (
                <List.Item actions={[<Link to={`/products/edit/${item.id}`}>编辑</Link>,<MoreBtn id={item.id} />]}>
                  <List.Item.Meta
                    title={<Link to={`/products/${item.id}`}>{item.name}</Link>}
                    description={item.description}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
        <ProductCreateForm 
        wrappedComponentRef={this.saveFormRef}
        visible={this.state.visible}
        onCancel={this.handleCancel}
        onCreate={this.handleCreate}
         />
      </PageHeaderLayout>
    );
  }
}

const ProductCreateForm = Form.create()(
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="新建产品"
          okText="创建"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <FormItem label="产品名称">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入产品名称!' }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="产品描述">
              {getFieldDecorator('description')(<Input type="textarea" />)}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);
