import { PureComponent } from 'react';
import { Table, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { formatDate } from '@lib/date';
import Link from 'next/link';
import { ThumbnailPhoto } from '@components/photo/thumbnail-photo';
import { DropdownAction } from '@components/common/dropdown-action';

interface IProps {
  dataSource: [];
  rowKey: string;
  loading: boolean;
  pagination: {};
  onChange: Function;
  deletePhoto?: Function;
}

export class TableListPhoto extends PureComponent<IProps> {
  render() {
    const { deletePhoto } = this.props;
    const columns = [
      {
        title: '',
        dataIndex: 'thumbnail',
        render(data, record) {
          return <ThumbnailPhoto photo={record} />;
        }
      },
      {
        title: 'Title',
        dataIndex: 'title',
        sorter: true
      },
      // {
      //   title: 'Token',
      //   dataIndex: 'token',
      //   sorter: true,
      //   render(token: number) {
      //     return <span>{token}</span>;
      //   }
      // },
      {
        title: 'Status',
        dataIndex: 'status',
        sorter: true,
        render(status: string) {
          switch (status) {
            case 'active':
              return <Tag color="green">Active</Tag>;
            case 'inactive':
              return <Tag color="red">Inactive</Tag>;
            default: return <Tag color="default">{status}</Tag>;
          }
        }
      },
      {
        title: 'Performer',
        dataIndex: 'performer',
        render(data, record) {
          return <span>{record.performer && record.performer.username}</span>;
        }
      },
      {
        title: 'Last update',
        dataIndex: 'updatedAt',
        sorter: true,
        render(date: Date) {
          return <span>{formatDate(date)}</span>;
        }
      },
      {
        title: 'Actions',
        dataIndex: '_id',
        render: (id: string) => (
          <DropdownAction
            menuOptions={[
              {
                key: 'update',
                name: 'Update',
                children: (
                  <Link
                    href={{
                      pathname: '/photos/update',
                      query: { id }
                    }}
                    as={`/photos/update?id=${id}`}
                  >
                    <a>
                      <EditOutlined />
                      {' '}
                      Update
                    </a>
                  </Link>
                )
              },
              {
                key: 'delete',
                name: 'Delete',
                children: (
                  <span>
                    <DeleteOutlined />
                    {' '}
                    Delete
                  </span>
                ),
                onClick: () => deletePhoto && deletePhoto(id)
              }
            ]}
          />
        )
      }
    ];
    const {
      dataSource, rowKey, loading, pagination, onChange
    } = this.props;
    return (
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={rowKey}
        loading={loading}
        pagination={pagination}
        onChange={onChange.bind(this)}
        scroll={{ x: '120vw', y: '100vh' }}
      />
    );
  }
}
