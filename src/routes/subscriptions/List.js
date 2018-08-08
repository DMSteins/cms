import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Table,
  Popconfirm,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from '../List/TableList.less';
import { Link } from '../../../node_modules/dva/router';

@connect(({ subscriptions, loading }) => ({
    subscriptions: subscriptions.data,
    loading: loading.models.rule,
}))

export default class SubscriptionsList extends PureComponent {

  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    this.fetchSubscriptionsData();
  }

  fetchSubscriptionsData = (p = 1)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'subscriptions/fetchList',
      payload: {
        page: p,
        page_size: 10,
      },
    });
  }

  onChangePage = (page)=>{
    this.page = page;
    this.fetchTenantData(page);
  }

  confirmDelete = (id)=>{
    const { dispatch } = this.props;
      dispatch({
        type: 'tenant/deleteTenant',
        payload: {
          id: id
        },
        callback: this.deleteProductResult
      });

  }
  deleteProductResult = (params)=>{
    
    message.success('删除成功');
    
    this.fetchTenantData();
  }
  

  render() {
    const {
        subscriptions,
      loading,
    } = this.props;
    
    const paginationProps = {
      showQuickJumper: true,
      pageSize: 10,
      total: subscriptions.count > 0 ? subscriptions.count : 0,
      onChange: this.onChangePage,
    };

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

    const columns = [
      {
        title: '订阅客户名称',
        dataIndex: 'tenantId',
        key: 'tenantId',
        render: (text, record) => <Link to={`/tenants/${record.id}`}>{text}</Link>,
      },
      {
        title: '订阅产品名称',
        dataIndex: 'productionId',
        key: 'productionId',
      },
      {
        title: '到期时间',
        dataIndex: 'expires',
        key: 'expires',
        // sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },{
        title: '操作',
        render: (record) => (
          <Fragment>
            <Link to='/subscriptions/add'>编辑</Link>
            <Divider type="vertical" />
            <MoreBtn id={record.id}/>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderLayout title="订阅列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Link to='/subscriptions/add'>
              <Button icon="plus" type="primary">
                新建
              </Button></Link>
            </div>
            <Table
            rowKey={record=>record.id}
            loading={loading}
            // rowKey={rowKey || 'key'}
            // rowSelection={rowSelection}
            dataSource={subscriptions.rows}
            columns={columns}
            pagination={paginationProps}
            // onChange={this.handleTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}