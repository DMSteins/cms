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

@connect(({ tenant, loading }) => ({
  tenant: tenant.tenants,
  loading: loading.models.rule,
}))

export default class TenantsList extends PureComponent {

  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    this.fetchTenantData();
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

  onChangePage = (page)=>{
    this.page = page;
    this.fetchTenantData(page);
  }

  render() {
    const {
      tenant,
      loading,
    } = this.props;
    
    const paginationProps = {
      showQuickJumper: true,
      pageSize: 10,
      total: tenant.count > 0 ? tenant.count : 0,
      onChange: this.onChangePage,
    };

    const MoreBtn = (item) => (
      <Dropdown overlay={
        (
          <Menu>
            <Menu.Item>
            <Popconfirm title="确定删除该产品吗？" okText="确定" cancelText="取消">
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
        title: '客户名称',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => <Link to={`/tenants/${record.id}`}>{text}</Link>,
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: '地区',
        dataIndex: 'region',
        key: 'region',
      },
      {
        title: '联系人',
        dataIndex: 'contact',
        key: 'contact',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '到期时间',
        dataIndex: 'expires',
        key: 'expires',
        // sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },{
        title: '操作',
        render: () => (
          <Fragment>
            <a href="">编辑</a>
            <Divider type="vertical" />
            <MoreBtn />
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderLayout title="客户列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Link to='/tenants/add'>
              <Button icon="plus" type="primary">
                新建
              </Button></Link>
            </div>
            <Table
            rowKey={record=>record.id}
            loading={loading}
            // rowKey={rowKey || 'key'}
            // rowSelection={rowSelection}
            dataSource={tenant.rows}
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