import Mock from 'mockjs'
// 模拟用户数据
const userData = Mock.mock({
  'list|3': [{
    'id|+1': 1,
    'name': '@cname',
    'age|18-60': 1,
    'gender|1': ['男', '女'],
    'email': '@EMAIL',
    'avater': Mock.Random.image('50x50', '#00405d', '#FFF', '团购')
  }]
})
Mock.mock('/mockUserData', { code: 200, data: userData })