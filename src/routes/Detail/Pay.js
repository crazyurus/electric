import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Badge, Table } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

@connect(({ pay, loading }) => ({
  record: pay.record,
  listLoading: loading.effects['pay/record'],
}))
export default class PayRecordList extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'pay/record',
    });
  }

  render() {
    const { record, listLoading } = this.props;
    const columns = [
      {
        title: '订单号',
        dataIndex: 'no',
        align: 'center',
      },
      {
        title: '类型',
        align: 'center',
        dataIndex: 'type',
        render(value) {
          let color = '';
          switch (value) {
            case '微信支付':
            case '缴费平台支付':
              color = 'success';
              break;
            case '系统售电':
              color = 'processing';
              break;
            case '统一月补':
              color = 'warning';
              break;
            case '临时调剂':
              color = 'error';
              break;
            case '一卡通售电':
            default:
              color = 'default';
              break;
          }
          return <Badge status={color} text={value} />;
        },
        filters: [
          { text: '微信支付', value: '微信支付' },
          { text: '缴费平台支付', value: '缴费平台支付' },
          { text: '系统售电', value: '系统售电' },
          { text: '统一月补', value: '统一月补' },
          { text: '临时调剂', value: '临时调剂' },
          { text: '一卡通售电', value: '一卡通售电' },
        ],
        onFilter: (value, current) => current.type === value,
      },
      {
        title: '充值金额',
        align: 'center',
        dataIndex: 'price',
        render(value) {
          return '¥' + Number.parseFloat(value).toFixed(2);
        },
        sorter: (a, b) => Number.parseFloat(a.price) - Number.parseFloat(b.price),
      },
      {
        title: '充值电量',
        align: 'center',
        dataIndex: 'count',
      },
      {
        title: '支付时间',
        align: 'center',
        dataIndex: 'pay_time',
      },
      {
        title: '完成时间',
        align: 'center',
        dataIndex: 'out_time',
      },
      {
        title: '订单状态',
        align: 'center',
        dataIndex: 'status',
        filters: [{ text: '正在下发', value: '正在下发' }, { text: '下发成功', value: '下发成功' }],
        onFilter: (value, current) => current.status === value,
        render(value) {
          return <Badge status={value === '下发成功' ? 'success' : 'processing'} text={value} />;
        },
      },
    ];

    return (
      <PageHeaderLayout title="充值记录" content="该宿舍线上及线下的所有充值记录">
        <Card bordered={false}>
          <div>
            <Table loading={listLoading} dataSource={record} columns={columns} rowKey="no" />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
