import axios from 'axios';
import jsonpAdapter from 'axios-jsonp';

export function getPosition() {
  const accessKey = 'ECCBZ-HMTKQ-SJY5I-GL4YB-EEKS6-ZKFDN';

  return axios({
    url: `//map.qq.com/api/js?v=2.exp&key=${accessKey}`,
    adapter: jsonpAdapter
  });
}
