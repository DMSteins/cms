import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  Divider,
  Table,
  Dropdown,
  Menu,
  Popconfirm,
  Icon,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from 'components/DescriptionList';
import { getLocalStorage } from '../../utils/help';
import { Router } from '../../../node_modules/dva/router';
// import styles from '../Products/style.less';
import styles from '../Products/Detail.less';
import { Link } from 'dva/router';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Description } = DescriptionList;

@connect(( { tenant, subscriptions })=>({
  currentTenant: tenant.currentTenant,
  subscriptions: subscriptions.data,
}))

export default class DetailTenant extends PureComponent {

  componentDidMount(){
    this.fetchTenantsData();
    this.fetchSubscriptionsData();
  }

  fetchTenantsData = ()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'tenant/detailTenant',
      payload: {
        id: this.props.match.params.id,
      }
    });
  }

  fetchSubscriptionsData = (p = 1)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'subscriptions/fetchList',
      payload: {
        page: p,
        page_size: 10,
        tenant_id: this.props.match.params.id,
      },
    });
  }

  render() {
    const { currentTenant, subscriptions, loading } = this.props;

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
        title: '订阅产品名称',
        dataIndex: 'productionName',
        key: 'productionName',
        render: (text, record)=><Link to={`/products/${record.productionId}`}>{text}</Link>
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
            <Link to={`/subscriptions/Edit/${currentTenant.id}/${record.id}`}>编辑</Link>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderLayout
        title="客户详情"
      >

        <Card bordered={false}>
        <DescriptionList size="large" title="客户信息" style={{ marginBottom: 32 }}>
            <Description term="姓名">{currentTenant.name}</Description>
            <Description term="描述">{currentTenant.description}</Description>
            <Description term="地区">{currentTenant.region}</Description>
            <Description term="地址">{currentTenant.location}</Description>
            <Description term="联系人">{currentTenant.contact}</Description>
            <Description term="手机号">{currentTenant.phone}</Description>
            <Description term="过期时间">{moment(currentTenant.expires).format('YYYY-MM-DD HH:mm')}</Description>
            <Description term="上限数量">{currentTenant.limit}</Description>
            <Description term="创建时间">{moment(currentTenant.createdAt).format('YYYY-MM-DD HH:mm')}</Description>
        </DescriptionList>
        <Divider style={{ marginBottom: 32 }} />
        <div className={styles.title}>已订阅产品信息</div>
        <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Link to={`/subscriptions/add/${currentTenant.id}`}>
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
