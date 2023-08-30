module.exports = (info) => {
	return (
		`
import { request } from '@umijs/max';
import { ${info.pageName}List, ${info.pageName}Params } from './typings';

/** POST /xxx/page */
export async function queryListData(body: ${info.pageName}Params) {
	return request<API.List_Result<${info.pageName}List>>('/xxx/page', {
		method: 'POST',
		data: body,
	});
}
		`
	)
}