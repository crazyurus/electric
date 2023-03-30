import React from 'react';
import styles from './mobile.less';

export default function Mobile() {
  return (
    <div className={styles.phone}>
      <iframe src="/mobile" frameBorder="0" scrolling="no" />
      <div onClick={() => window.history.back()} title="返回" />
    </div>
  );
}
