const path = require('path')
const fs = require('fs-extra')
const pageData = require('../static/page');
const serviceData = require('../static/service');
const typeData = require('../static/type');

const generateFile = (targetFile, fileData) => {
  return new Promise((resolve)=>{
    fs.writeFileSync(targetFile, fileData);
    resolve(true);
  })
}

const reWriteRouteFile = (targetFolder, info) => {
  return new Promise((resolve)=>{
    const targetFile = path.resolve(targetFolder, 'routes.ts');
    const fileData = fs.readFileSync(targetFile, 'utf-8');

    // 使用正则表达式替换并插入数据
    const regex = /\[(.*?)\]/s;
    const matches = fileData.match(regex);
    const extractedData = matches[1];
    let newData = '';
    if (info.detailType !== 'new') {
      newData = `[${extractedData}  {
    name: '${info.pageName.charAt(0).toLowerCase() + info.pageName.slice(1)}',
    path: '/${info.pageName.replace(/([A-Z])/g, "-$1").toLowerCase().slice(1)}',
    component: '@/pages/${info.pageName}/index',
  },
]`
    } else {
      newData = `[${extractedData}  {
    name: '${info.pageName.charAt(0).toLowerCase() + info.pageName.slice(1)}',
    path: '/${info.pageName.replace(/([A-Z])/g, "-$1").toLowerCase().slice(1)}',
    component: '@/pages/${info.pageName}/index',
  },
  {
    name: '${info.pageName.charAt(0).toLowerCase() + info.pageName.slice(1)}Detail',
    path: '/${info.pageName.replace(/([A-Z])/g, "-$1").toLowerCase().slice(1)}-detail',
    component: '@/pages/${info.pageName}/detail',
  },
]`
    }
    
    const result = fileData.replace(regex, newData);
    fs.writeFileSync(targetFile, result);
    resolve(true);
  })
}

module.exports = async function (info, option) {
  /**
   * 1、创建页面目录 （page页面，service页面）
   * 2、修改路由指向（routes.ts）
   * 3、生成页面信息
   */
  // 1、创建页面目录 （page页面，service页面）
  const cwd = process.cwd();
  const pageFolder = path.join(`${cwd}/src/pages`, info.pageName);
  const serviceFolder = path.join(`${cwd}/src/services`, info.pageName);

  if (fs.existsSync(pageFolder)) {
    console.log('文件夹已存在!')
  } else {
    fs.mkdir(pageFolder)
  }

  if (fs.existsSync(serviceFolder)) {
    console.log('文件夹已存在!')
  } else {
    fs.mkdir(serviceFolder)
  }

  // 2、修改路由指向（routes.ts）
  reWriteRouteFile(`${cwd}/config/libs`, info);
  

  // 3、生成页面信息
  const pageFile = path.join(pageFolder, 'index.tsx');
  const pageDetailFile = path.join(pageFolder, 'detail.tsx');
  const serviceFile = path.join(serviceFolder, 'index.tsx');
  const serviceTypeFile = path.join(serviceFolder, 'typings.d.ts');
  generateFile(pageFile, JSON.parse(JSON.stringify(pageData({info}))));
  if (info.detailType === 'new') {
    generateFile(pageDetailFile, '');
  }
  generateFile(serviceFile, JSON.parse(JSON.stringify(serviceData({info}))));
  generateFile(serviceTypeFile, JSON.parse(JSON.stringify(typeData({info}))));

}