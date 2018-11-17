import request from '../utils/request';

const host = 'palmwhut.sinaapp.com';

export default {
  async ip() {
    return request(host, '/ip.php');
  },
};
