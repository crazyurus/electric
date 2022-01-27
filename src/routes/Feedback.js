import React from 'react';
import { Card, List } from 'antd';
import PageHeaderLayout from '../layouts/PageHeaderLayout';
import styles from './Feedback.less';

import imageIWUT from '@/assets/feedback/iwut.png';
import imageQQ from '@/assets/feedback/qq.png';
import imageWeChat from '@/assets/feedback/wechat.png';
import imageTucao from '@/assets/feedback/tucao.png';

export default class Feedback extends React.Component {
  render() {
    const feedbackList = [
      {
        name: '吐个槽社区',
        desc: '欢迎随时来吐槽',
        link: 'https://support.qq.com/product/23796',
        avatar: imageTucao,
      },
      {
        name: '掌上理工大用户群',
        desc: '掌理粉丝聚集地',
        link: 'http://qm.qq.com/cgi-bin/qm/qr?k=akqtesBtpS0gc9r4Fn0VqWx0li__8JgZ',
        avatar: imageIWUT,
      },
      {
        name: '小纬QQ',
        desc: 'Token团队的萌妹子',
        link: 'http://sighttp.qq.com/authd?IDKEY=ef6445db7bb631874b7e44061d0acd803cb77a3b8306251d',
        avatar: imageQQ,
      },
      {
        name: '微信公众号',
        desc: 'Token团队公众号搜索wutnews关注',
        link: 'javascript:;',
        avatar: imageWeChat,
      },
    ];

    return (
      <PageHeaderLayout>
        <div className={styles.cardList}>
          <List
            rowKey="name"
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={feedbackList}
            renderItem={item => (
              <List.Item key={item.name}>
                <Card hoverable className={styles.card}>
                  <Card.Meta
                    title={
                      <a href={item.link} target="_blank" rel="noopener noreferrer">
                        {item.name}
                      </a>
                    }
                    avatar={
                      <img
                        alt="avatar"
                        className={styles.cardAvatar}
                        src={item.avatar}
                      />
                    }
                    description={item.desc}
                  />
                </Card>
              </List.Item>
            )}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
