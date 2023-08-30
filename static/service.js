module.exports = () => {
	return (
		`
import { request } from '@umijs/max';
import { SNS_API } from 'config/settings/constants';
import { LivingManagerList, LivingManagerParams } from './typings';

/** POST /live/live-config/page */
export async function queryLivingManagerList(body: LivingManagerParams) {
	return request<API.List_Result<LivingManagerList>>('/live-config/page', {
		method: 'POST',
		data: body,
	});
}
		`
	)
}