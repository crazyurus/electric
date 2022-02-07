import React from 'react';
import styles from './mobile.less';

export default class Mobile extends React.Component {
  render() {
    return (
      <div className={styles.phone}>
        <iframe src="/mobile" frameBorder="0" scrolling="no" />
        <div onClick={() => window.history.back()} title="返回" />
      </div>
    );
  }
}
