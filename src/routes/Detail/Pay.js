import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Badge } from 'antd';
import StandardTable from 'components/StandardTable';
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
      },
      {
        title: '类型',
        render(value) {
          let color = '';
          switch (value.type) {
            case '微信支付': color = 'success'; break;
            case '系统售电': color = 'processing'; break;
            case '统一月补': color = 'warning'; break;
            case '临时调剂': color = 'error'; break;
            case '一卡通售电':
            default: color = 'default'; break;
          }
          return <Badge status={color} text={value.type} />
        },
      },
      {
        title: '充值金额',
        render(value) {
          return '¥' + Number.parseFloat(value.price).toFixed(2);
        },
      },
      {
        title: '充值电量',
        dataIndex: 'count',
      },
      {
        title: '支付时间',
        dataIndex: 'pay_time',
      },
      {
        title: '完成时间',
        dataIndex: 'out_time',
      },
      {
        title: '订单状态',
        render(value) {
          return <Badge status={value.status === '下发成功' ? 'success' : 'processing'} text={value.status} />
        },
      },
    ];

    return (
      <PageHeaderLayout title="充值记录" content="该宿舍线上及线下的所有充值记录">
        <Card bordered={false}>
          <div>
            <StandardTable
              hideRowSelection
              loading={listLoading}
              data={{ list: record }}
              columns={columns}
              rowKey="no"
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
