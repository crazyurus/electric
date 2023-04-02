import axios from 'axios';
import jsonpAdapter from 'axios-jsonp';

interface Station {
  name: string;
  position: [number, number];
  telephone: string;
  address: string;
}

export function initMap(): Promise<void> {
  const accessKey = 'ECCBZ-HMTKQ-SJY5I-GL4YB-EEKS6-ZKFDN';

  return axios({
    url: `//map.qq.com/api/js?v=2.exp&key=${accessKey}`,
    adapter: jsonpAdapter
  });
}

export function getStations(): Station[] {
  return [
    {
      name: '南湖',
      position: [30.5125, 114.329079],
      telephone: '13317102360',
      address: '后街医务室旁，北七宿舍对面'
    },
    {
      name: '西院/鉴湖',
      position: [30.513068, 114.343386],
      telephone: '027-87381736',
      address: '鉴湖主教学楼西侧'
    },
    {
      name: '东院',
      position: [30.521752, 114.351904],
      telephone: '027-87859134',
      address: '东院大门右侧'
    },
    {
      name: '余区',
      position: [30.607892, 114.357253],
      telephone: '027-86860918',
      address: '水电中心收费大厅'
    },
    {
      name: '升升公寓',
      position: [30.50456, 114.344748],
      telephone: '',
      address: '物业办公楼一层'
    }
  ];
}
