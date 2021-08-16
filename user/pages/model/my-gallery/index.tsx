import { PureComponent } from 'react';
import {
  Layout, message, Button, Row, Col
} from 'antd';
import { PlusOutlined, PictureOutlined } from '@ant-design/icons';
import PageHeading from '@components/common/page-heading';
import Head from 'next/head';
import { TableListGallery } from '@components/gallery/table-list';
import { SearchFilter } from '@components/common/search-filter';
import Link from 'next/link';
import { galleryService } from '@services/gallery.service';
import { connect } from 'react-redux';
import { IUIConfig } from 'src/interfaces';

interface IProps {
  ui: IUIConfig;
}

interface IStates {
  galleries: [];
  loading: boolean;
  filters: {};
  sortBy: string;
  sort: string;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
}

class GalleryListingPage extends PureComponent<IProps, IStates> {
  static authenticate = true;

  static onlyPerformer = true;

  constructor(props: IProps) {
    super(props);
    this.state = {
      galleries: [],
      loading: true,
      filters: {},
      sortBy: 'createdAt',
      sort: 'desc',
      pagination: { current: 1, pageSize: 12, total: 0 }
    };
  }

  async componentDidMount() {
    this.search();
  }

  async handleSorterChange(pagination, filters, sorter) {
    const { pagination: statePagination } = this.state;
    await this.setState({
      pagination: {
        ...statePagination,
        current: pagination.current
      },
      sortBy: sorter.field || 'createdAt',
      // eslint-disable-next-line no-nested-ternary
      sort: sorter.order ? (sorter.order === 'ascend' ? 'asc' : 'desc') : ''
    });
    this.search();
  }

  async handleDeleteGallery(id: string) {
    if (!window.confirm('Are you sure to delete this gallery?')) return;
    try {
      await galleryService.delete(id);
      message.success('Deleted success!');
      this.search();
    } catch (e) {
      const err = (await Promise.resolve(e)) || {};
      message.error(err.message || 'An error occurred, please try again!');
    }
  }

  async handleFilter(params) {
    const { pagination, filters } = this.state;
    await this.setState({
      filters: { ...filters, ...params },
      pagination: {
        ...pagination,
        current: 1
      }
    });
    this.search();
  }

  async search() {
    try {
      const {
        filters, pagination, sort, sortBy
      } = this.state;
      const resp = await galleryService.search({
        ...filters,
        limit: pagination.pageSize,
        offset: (pagination.current - 1) * pagination.pageSize,
        sort,
        sortBy
      });
      await this.setState({
        galleries: resp.data.data,
        pagination: {
          ...pagination,
          total: resp.data.total
        }
      });
    } catch (error) {
      message.error('Something went wrong. Please try again!');
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    const { ui } = this.props;
    const { galleries, pagination, loading } = this.state;
    const statuses = [
      {
        key: '',
        text: 'Status'
      },
      {
        key: 'active',
        text: 'Active'
      },
      {
        key: 'inactive',
        text: 'Inactive'
      }
    ];
    return (
      <Layout>
        <Head>
          <title>
            {' '}
            {ui && ui.siteName}
            {' '}
            | My Galleries
          </title>
        </Head>
        <div className="main-container">
          <PageHeading title="My Galleries" icon={<PictureOutlined />} />
          <div>
            <Row>
              <Col lg={20} xs={24}>
                <SearchFilter statuses={statuses} searchWithKeyword onSubmit={this.handleFilter.bind(this)} />
              </Col>
              <Col lg={4} xs={24} style={{ display: 'flex', alignItems: 'center' }}>
                <Button className="secondary">
                  <Link href="/model/my-gallery/create">
                    <a>
                      <PlusOutlined />
                      {' '}
                      Create New
                    </a>
                  </Link>
                </Button>
              </Col>
            </Row>
          </div>
          <div className="table-responsive">
            <TableListGallery
              dataSource={galleries}
              rowKey="_id"
              loading={loading}
              pagination={pagination}
              onChange={this.handleSorterChange.bind(this)}
              deleteGallery={this.handleDeleteGallery.bind(this)}
            />
          </div>
        </div>
      </Layout>
    );
  }
}

const mapStates = (state: any) => ({
  ui: state.ui
});
export default connect(mapStates)(GalleryListingPage);
