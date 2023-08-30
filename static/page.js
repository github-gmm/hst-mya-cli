module.exports = () => {
	return (
		`
import HsTable from '@/components/HsTable';
import { renderOptions } from '@/utils';
import intl from '@/utils/intl';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import React, { useRef } from 'react';

const Index: React.FC = () => {
	// 表格ref
	const actionRef = useRef<ActionType>();

	const columns: ProColumns[] = [
		{
			title: intl.$T('hs.sns.live.manager.field.option').$D('操作'),
			valueType: 'option', // 操作列
			key: 'option', // 操作列
			render: () =>
				renderOptions([
					{
						key: 'edit',
						name: '编辑',
						onClick: () => {},
					},
				]),
		},
		{
			title: ['startTime', 'endTime'],
			dataIndex: 'startAndOverTime',
			valueType: 'dateRange',
			hideInTable: true,
			search: {
				transform: (value: any) => ({ startTime: value[0], overTime: value[1] }),
			},
		},
		{
			title: 'key',
			dataIndex: 'key',
			search: {
				transform: (value: any) => ({ keyword: value }),
			},
		},
		{
			title: 'name1',
			dataIndex: 'name1',
		},
	];

	const headBtn: any = renderOptions(
		[
			{
				key: 'add',
				name: '新增',
				onClick: () => {},
			},
			{
				key: 'export',
				name: '导出',
				onClick: () => {},
			},
		],
		'btn'
	);

	const headBatchBtn: any = (selectedRowKeys: any, selectedRows: any, onCleanSelected: any) => {
		return renderOptions(
			[
				{
					key: 'batchExport',
					name: '批量导出',
					onClick: () => {
						console.log(selectedRowKeys, selectedRows, onCleanSelected);
						actionRef.current?.reload();
						onCleanSelected();
					},
				},
				{
					key: 'batchDelete',
					name: '批量删除',
					onClick: () => {
						console.log(selectedRowKeys, selectedRows, onCleanSelected);
						onCleanSelected();
					},
				},
			],
			'text',
			5
		);
	};

	const requestApi = async (params: any) => {
		const { current, pageSize, ...otherParams } = params;
		console.log(current);
		console.log(pageSize);
		console.log(otherParams);
		return {
			success: true,
			data: [
				{
					name1: 123,
					key: 1,
				},
			],
			total: 1,
		};
	};

	return (
		<HsTable
			primaryKey='key'
			actionRef={actionRef}
			columns={columns}
			headBtn={headBtn}
			headBatchBtn={headBatchBtn}
			requestApi={requestApi}
		/>
	);
};

export default Index;
		`
	)
}