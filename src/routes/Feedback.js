import React from 'react';
import { Card, List } from 'antd';
import PageHeaderLayout from '../layouts/PageHeaderLayout';
import styles from './Feedback.less';

export default class Feedback extends React.Component {

  render() {
    const feedbackList = [
      {
        name: '吐个槽社区',
        desc: '欢迎随时来吐槽',
        link: 'https://support.qq.com/products/23798',
        avatar: 'tucao',
      },
      {
        name: '掌上理工大用户群',
        desc: '掌理粉丝聚集地',
        link: 'http://qm.qq.com/cgi-bin/qm/qr?k=akqtesBtpS0gc9r4Fn0VqWx0li__8JgZ',
        avatar: 'iwut',
      },
      {
        name: '小纬QQ',
        desc: 'Token团队的萌妹子',
        link: 'http://sighttp.qq.com/authd?IDKEY=ef6445db7bb631874b7e44061d0acd803cb77a3b8306251d',
        avatar: 'qq',
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
                    title={<a href={item.link} className="external" target="_blank">{item.name}</a>}
                    avatar={<img className={styles.cardAvatar} src={'/Application/Electric/Assets/image/feedback/' + item.avatar + '.png'} />}
                    description={item.desc}
                  />
                </Card>
              </List.Item>
              )
            }
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
