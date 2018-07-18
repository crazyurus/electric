import React from 'react';
import styles from './mobile.less';

export default class Mobile extends React.Component {
  render() {
    return (
      <div className={styles.phone}>
        <iframe src="/electric" frameBorder="0" scrolling="no" />
        <div onClick={() => history.back()} title="返回" />
      </div>
    );
  }
}
