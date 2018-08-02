import React, { Component, PureComponent } from 'react';
import { connect } from 'dva';
import {
  Divider,
  Card,
  List,
  Icon,
  Dropdown,
  Menu,
  Popconfirm,
  Button,
  Form,
  Modal,
  Input,
  message,
} from 'antd';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Detail.less';
import { Link } from 'dva/router';
import { delay } from '../../../node_modules/lodash-decorators';

const { Description } = DescriptionList;
const FormItem = Form.Item;

@connect(({ product, loading, modules}) => ({
    currentPro: product.currentPro,
    loading: loading.effects['modules/fetchList'],
    modulesList: modules.modulesList,
    currentModule: modules.currentModule,
}))

export default class DetailProduct extends PureComponent {
  state = {
    visible: false,
    editVisible: false,
    editID: "",
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/fetchProduct',
      payload: {
        id: this.props.match.params.id,
      },
    });
    this.fetchModuleList();
  }

  fetchModuleList = ()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'modules/fetchList',
      payload: {
        id: this.props.match.params.id,
      },
    });
  }

  showModal = (id) => {
    this.setState({ visible: true });
  }

  handleCancel = () => {
    this.setState({ visible: false, editID: "", editVisible: false });
  }

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }

  createResult= (params)=>{
    
    if(params){
      message.success('添加成功');
    }else{
      message.error('添加失败');
    }
    this.fetchModuleList();

  }

  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
  
      const { dispatch } = this.props;
      dispatch({
        type: 'modules/addModule',
        payload: {
          ...values,
          id: this.props.match.params.id,
        },
        callback: this.createResult
      });

      form.resetFields();
      this.setState({
        visible: false,
      });
      
    });
  }

  deleteResult = ()=>{
    message.success('删除模块成功');
    this.fetchModuleList();
  }

  confirmDelete = (id)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'modules/deleteModule',
      payload: {
        id: id
      },
      callback: this.deleteResult
    });
  }

  showEditModal = (id)=>{
    this.setState({
      editVisible: true,
      editID: id,
    });
    const { dispatch } = this.props;
      dispatch({
        type: 'modules/fetchModuleData',
        payload: {
          id: id
        },
      });
  }
  editResult = (response)=>{
    message.success('修改模块成功');
    this.fetchModuleList();
  }
  handleEdit = ()=>{
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
  
      const { dispatch } = this.props;
      const editModuleID = this.state.editID;
      dispatch({
        type: 'modules/editModule',
        payload: {
          ...values,
          id: editModuleID,
          productionId: this.props.match.params.id,
        },
        callback: this.editResult
      });

      form.resetFields();
      this.setState({
        visible: false,
        editID: "", 
        editVisible: false,
      });
      
    });
  }

  render() {
    const { modulesList, currentPro, loading, currentModule } = this.props;

    const MoreBtn = (item) => (
      <Dropdown overlay={
        (
          <Menu>
            <Menu.Item>
            <Popconfirm title="确定删除该模块吗？" onConfirm={()=>this.confirmDelete(item.id)} okText="确定" cancelText="取消">
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
      <PageHeaderLayout title="产品详情页">
        <Card bordered={false}>
        <DescriptionList size="large" title='产品信息'>
            <Description term="产品名称">
            {currentPro.name}
            </Description>
        </DescriptionList>
        <DescriptionList size="large" col="1">
            <Description term="产品描述">{console.log}
            {currentPro.description}
            </Description>
        </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.title}>产品模块</div>
          <Button type="dashed" style={{ width: '100%', marginBottom: 8 }} icon="plus"
            onClick={this.showModal}
            >
              添加
            </Button>
          <List
              size="large"
              loading={loading}
              // pagination={paginationProps}
              dataSource={modulesList}
              renderItem={item => (
                <List.Item actions={[<a onClick={this.showEditModal.bind(this, item.id)}>编辑</a>,<MoreBtn id={item.id} />]}>
                  <List.Item.Meta
                    title={item.name}
                    description={item.description}
                  />
                  {/* <ListContent data={item} /> */}
                </List.Item>
              )}
            />
        </Card>
        <ModulesCreateForm 
        wrappedComponentRef = {this.saveFormRef}
        visible = {this.state.visible}
        onCreate = {this.handleCreate}
        onCancel = {this.handleCancel}
        />
        <ModulesEditForm
        wrappedComponentRef = {this.saveFormRef}
        editVisible = {this.state.editVisible}
        onCreate = {this.handleEdit}
        onCancel = {this.handleCancel}
        moduleData = {currentModule}
        />
      </PageHeaderLayout>
    );
  }
}

const ModulesCreateForm = Form.create()(
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="新建产品模块"
          okText="创建"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <FormItem label="模块名称" >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入模块名称!' }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="模块描述">
              {getFieldDecorator('description')(<Input type="textarea" />)}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);

const ModulesEditForm = Form.create()(
  class extends React.Component {
    
    render() {
      const { editVisible, onCancel, onCreate, form, moduleData } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={editVisible}
          title="编辑产品模块"
          okText="确定"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <FormItem label="模块名称">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入模块名称!' }],
                initialValue: moduleData.name ? moduleData.name : "",
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="模块描述">
              {getFieldDecorator('description', {
                initialValue: moduleData.description ? moduleData.description : "",
              })(<Input type="textarea" />)}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);


