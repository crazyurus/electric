import React, { PureComponent, Fragment } from 'react';
import Map from 'react-amap/lib/map';
import Marker from 'react-amap/lib/marker';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

export default class StepForm extends PureComponent {
  render() {
    const station = this.props.location.query;
    const position = { longitude: station.position[1], latitude: station.position[0] };
    return (
      <PageHeaderLayout
        title={station.name + '电费充值点'}
        content={
          <Fragment>
            <span>
              {station.name === '升升公寓'
                ? '武汉升升学府物业管理有限公司'
                : '武汉理工大学水电管理中心'}
            </span>
            <br />
            <span>
              联系电话：{station.telephone ? (
                <a href={'tel:027-' + station.telephone}>{station.telephone}</a>
              ) : (
                '暂无'
              )}
            </span>
          </Fragment>
        }
      >
        <div
          style={{
            width: '100%',
            height: '500px',
            boxShadow: '0 1px 2px rgba(0,0,0,.3)',
            marginBottom: '5px',
          }}
        >
          <Map zoom={18} center={position} amapkey="65cbe6050f66a21c8dc6c274770f2de7">
            <Marker position={position} />
          </Map>
        </div>
      </PageHeaderLayout>
    );
  }
}
