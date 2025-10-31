import React from 'react';
import { Table, Toggle, TagPicker, VStack, HStack } from 'rsuite';
import { mockUsers } from './mock';

const { Column, HeaderCell, Cell } = Table;

const defaultColumns = [
    {
        key: 'id',
        label: 'Id',
        fixed: true,
        width: 70
    },
    {
        key: 'Class Name',
        label: 'Class Name',
        fixed: true,
        width: 130
    }
];

const ListTable = () => {
    const [columnKeys, setColumnKeys] = React.useState(defaultColumns.map(column => column.key));

    const columns = defaultColumns.filter(column => columnKeys.some(key => key === column.key));
    const CustomCell =  Cell
    const CustomHeaderCell = HeaderCell

    return (
        <div style={{
            width:"100%"
        }}>
            <VStack spacing={16}>
                <TagPicker
                    data={defaultColumns}
                    labelKey="label"
                    valueKey="key"
                    value={columnKeys}
                    onChange={setColumnKeys}
                    cleanable={false}
                />
            </VStack>
            <hr />

            <Table
                height={400}
                hover={true}
                showHeader={true}
                data={[]}
                bordered={true}
                cellBordered={true}
                headerHeight={40}
                rowHeight={46}
            >
                {columns.map(column => {
                    const { key, label, ...rest } = column;
                    return (
                        <Column {...rest} key={key}>
                            <CustomHeaderCell>{label}</CustomHeaderCell>
                            <CustomCell dataKey={key} />
                        </Column>
                    );
                })}
            </Table>
        </div>
    )
}

export default ListTable