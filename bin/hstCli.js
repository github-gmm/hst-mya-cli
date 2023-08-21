#! /usr/bin/env node

const program = require("commander");
const create = require('./createCode');
const inquirer = require('inquirer')

const questions = [
  {
    type: 'list',
    message: '请选择创建子应用还是独立应用？',
    name: 'appType',
    choices: [
        {
          name: 'admin子应用',
          value: 'microApp'
        },
        {
          name: 'admin独立应用(带登录注册)',
          value: 'inDepApp'
        },
    ]
  },
  {
    type: 'list',
    message: '请选择展业地？',
    name: 'site',
    choices: [
        {
          name: '主站',
          value: 'VK'
        },
        {
          name: '新加坡',
          value: 'TK'
        },
        {
          name: '马来',
          value: 'MY'
        },
        {
          name: '沙特',
          value: 'SA'
        },
    ]
  },
]

// 定义指令
program
  .version('1.0.0')
  .option('-h, --help', '用法')

program
  .command(`create`)
  .description("创建一个项目")
  .argument("<app-name>", "项目名称")
  .option("-f, --force [mode]", "强制覆盖")
  .action((name, options) => {
    // 回调函数
  	console.log(`脚手架生成项目 ${name}`);
    inquirer.prompt(questions).then(async answer=>{
      create({ ...answer, projectName: name}, options);
    })
  })
program
  .on('--help',()=>{
    console.log('');
    console.log('');
  }) 

// 解析命令行参数
program.parse(process.argv);