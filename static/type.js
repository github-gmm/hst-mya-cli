module.exports = (info) => {
  return `
/* eslint-disable */

export type ${info.pageName}Params = {
};

export type ${info.pageName}List = {
  dataList: {
  };
  totalCount: number;
};
  `
}