/* eslint-disable react/destructuring-assignment */
import { formatDate } from '@lib/date';
import {
  Button, Collapse, Table, Tag
} from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import { getGlobalConfig } from '@services/config';

interface IProps {
  items: any[];
  total: number;
  pageSize: number;
  searching: boolean;
  submiting: boolean;
  onChange: Function;
}

const reportTableList = ({
  items,
  total,
  pageSize,
  searching,
  onChange
}: IProps) => {
  const columns = [
    {
      title: 'User',
      dataIndex: 'sourceInfo',
      key: 'sourceInfo',
      render: (user) => (
        <span>
          {user?.name || user?.username || 'N/A'}
        </span>
      )
    },
    {
      title: 'Model',
      dataIndex: 'performerInfo',
      key: 'performerInfo',
      render: (performer) => (
        <span>
          {performer?.name || performer?.username || 'N/A'}
        </span>
      )
    },

    {
      title: 'Object',
      dataIndex: 'target',
      key: 'target',
      render: (target) => (
        <Tag color="blue" style={{ textTransform: 'capitalize' }}>{target}</Tag>
      )
    },
    {
      title: 'Reason',
      key: 'description',
      render: (record) => (
        <Collapse ghost accordion expandIconPosition="right">
          <Collapse.Panel
            header={record?.title || record?.description}
            key="1"
          >
            {record?.description}
          </Collapse.Panel>
        </Collapse>
      )
    },
    {
      title: 'Created at',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: Date) => <span>{formatDate(createdAt)}</span>,
      sorter: true
    },
    {
      title: 'Action',
      key: '_id',
      render: (report) => (
        <Button type="link">
          <a href={`/feed/update?id=${report.targetId}`}>View</a>
        </Button>
      )
    }
  ];

  const dataSource = items.map((p) => ({ ...p, key: p._id }));

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      className="table"
      pagination={{
        total,
        pageSize
      }}
      rowKey="_id"
      loading={searching}
      onChange={onChange.bind(this)}
    />
  );
};
export default reportTableList;
