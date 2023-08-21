const path = require('path')
const fs = require('fs-extra')
const ora = require('ora');
const chalk = require('chalk')
const sourceMap = require('../static/sourceMap');
const download = require('download-git-repo');

const downloadMicroApp = (projectFolder) => {
  const url = `http://gitlab.inzwc.com/hst-cs-web/admin/hst-template-micro.git`;
  const spinner = ora("下载中...");
  return new Promise((resolve) => {
    spinner.start();
    download(`direct:${url}`, projectFolder, { clone: true }, (err) => {
      if (err) {
        spinner.fail();
        console.log(chalk.red(`拉取代码失败！请稍后重试!`));
        console.log(chalk.red(`错误信息：${err}`));
        resolve(false);
      } else {
        spinner.succeed();
        console.log(chalk.green(`下载成功！`));
        resolve(true);
      }
    })
  })
}

const reWritePackageFile = (targetFolder, data) => {
  return new Promise((resolve)=>{
    const targetFile = path.resolve(targetFolder, 'package.json');
    const fileData = fs.readFileSync(targetFile, 'utf-8');
    // 替换
    const packageInfo = fileData.replace('project', data.projectName);
    fs.writeFileSync(targetFile, packageInfo);
    resolve(true);
  })
}

const reWriteConstantsFile = (targetFolder, data) => {
  return new Promise((resolve)=>{
    const targetFile = path.resolve(targetFolder, 'constants.ts');
    const fileData = fs.readFileSync(targetFile, 'utf-8');
    // 替换
    let packageInfo = fileData.replace('projectName', data.projectName);
    packageInfo = packageInfo.replace('sourceNameData', data.sourceName);
    packageInfo = packageInfo.replace('interfaceVtradeData', data.interfaceVtrade);
    packageInfo = packageInfo.replace('interfaceVbkrData', data.interfaceVbkr);
    fs.writeFileSync(targetFile, packageInfo);
    resolve(true);
  })
}

module.exports = async function (info, option) {
  /**
   * 1、创建项目目录
   * 2、拉取模板代码
   * 3、根据展业地修改模板
   */

  // 1、创建项目目录
  const cwd = process.cwd(); 
  const projectFolder = path.join(cwd, info.projectName);
  if (fs.existsSync(projectFolder)) {
    if (option.force) {
      await fs.remove(projectFolder);
    } else {
      console.log('文件夹已存在，请删除后重试！')
      return;
    }
  }

  // 2、拉取模板代码
  let res = false;
  if (info.appType === 'microApp') {
    res = await downloadMicroApp(info.projectName, projectFolder);
  } else {
    // const res = await downloadTemp(info.projectName, info.adminType);
    console.log(`\r\n ${chalk.red('暂未开发...')}`);
  }

  // 3、根据展业地修改模板
  if (res) {
    console.log(`\r\n ${chalk.red('修改配置文件...')}`);
    // 修改package.json文件
    await reWritePackageFile(projectFolder, info);

    //修改config / settings / constants.ts文件
    const constants = sourceMap[info.site];
    await reWriteConstantsFile(`${projectFolder}/config/settings`, {...info, ...constants});

    console.log(`\r\n ${chalk.green('创建成功！')}`);
  }
}