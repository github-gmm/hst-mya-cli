module.exports = (info) => {
	return (
		`
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { queryListData } from '@/services/${info.pageName}';
import HsTable from '@/components/HsTable';
import { renderOptions } from '@/utils';
import React, { useRef } from 'react';
import intl from '@/utils/intl';

const Index: React.FC = () => {
	// 表格ref
	const actionRef = useRef<ActionType>();

	const columns: ProColumns[] = [
		{
			title: intl.$T('hs.xxx.${info.pageName.replace(/([A-Z])/g, ".$1").toLowerCase().slice(1)}.field.option').$D('操作'),
			valueType: 'option', // 操作列
			key: 'option', // 操作列
			render: () =>
				renderOptions([
					{
						key: 'edit',
						name: 'edit',
						onClick: () => {},
					},
				]),
		},
		{
			// 列名称 / 筛选框的占位符
			title: ['startTime', 'endTime'],
			// 对应后端字段
			dataIndex: 'startAndOverTime',
			// 属性
			valueType: 'dateRange',
			// 隐藏表格
			hideInTable: true,
			// 筛选栏
			search: {
				transform: (value: any) => ({ startTime: value[0], overTime: value[1] }),
			},
		},
		{
			title: 'name',
			dataIndex: 'name',
		},
	];

	const headBtn: any = renderOptions(
		[
			{
				key: 'add',
				name: 'add',
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
					name: 'batchExport',
					onClick: () => {
						console.log(selectedRowKeys, selectedRows, onCleanSelected);
						actionRef.current?.reload();
						onCleanSelected();
					},
				},
				{
					key: 'batchDelete',
					name: 'batchDelete',
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
		try {
			const res = await queryListData({
				pageNo: current,
				pageSize,
				...otherParams
			});
			if (res.success) {
				return {
					success: true,
					data: res.data.dataList,
					total: res.data.totalCount,
				};
			} else {
				return {
					success: true,
					data: [],
					total: 0,
				};
			}
		} catch (error) {
			// demo，正式开发去掉
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
		}
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