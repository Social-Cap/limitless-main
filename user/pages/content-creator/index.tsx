import { PureComponent } from 'react';
import {
  Row, Col, Layout, Pagination, Spin
} from 'antd';
import { connect } from 'react-redux';
import { getList } from '@redux/performer/actions';
import PerformerCard from '@components/performer/card';
import Head from 'next/head';
import { PerformerAdvancedFilter } from '@components/common/base/performer-advanced-filter';
import { IUIConfig } from 'src/interfaces/';
import '@components/performer/performer.less';
import { DropOption } from '@components/common/base/drop-option';
import {
  CrownOutlined
} from '@ant-design/icons';
import Router from 'next/router';

interface IProps {
  getList: Function;
  performerState: any;
  ui: IUIConfig;
}

class Performers extends PureComponent<IProps> {
  static authenticate: boolean = true;

  static noredirect: boolean = true;

  state = {
    offset: 0,
    limit: 12
  };

  async componentDidMount() {
    const { getList: getListHandler } = this.props;
    const { limit, offset } = this.state;
    try {
      getListHandler({
        limit,
        offset,
        status: 'active'
      });
    } catch (e) {
      Router.back();
    }
  }

  handleFilter(values: any) {
    const { getList: getListHandler } = this.props;
    const { limit } = this.state;
    this.setState({ offset: 0 });
    getListHandler({
      limit,
      offset: 0,
      ...values
    });
  }

  handleSort(values: any) {
    const sort = {
      sort: values.key
    };
    const { getList: getListHandler } = this.props;
    const { limit } = this.state;
    this.setState({ offset: 0 });
    getListHandler({
      limit,
      offset: 0,
      ...sort,
      status: 'active'
    });
  }

  pageChanged = (page: number) => {
    const { getList: getListHandler } = this.props;
    const { limit } = this.state;
    this.setState({ offset: page });
    getListHandler({
      limit,
      offset: (page - 1) * 12
    });
  };

  render() {
    const {
      performerState = {
        requesting: false,
        error: null,
        success: false,
        data: null
      },
      ui
    } = this.props;
    const {
      limit, offset
    } = this.state;
    const performers = performerState?.data?.data || [];
    const total = performerState?.data?.total || 0;
    const { requesting: isLoading } = performerState;

    return (
      <>
        <Head>
          <title>
            {ui && ui.siteName}
            {' '}
            | Content Creators
          </title>
        </Head>
        <Layout>
          <div className="main-container">
            <PerformerAdvancedFilter
              onSubmit={this.handleFilter.bind(this)}
              countries={ui?.countries || []}
            />
            <div className="hr-divider" />
            <div className="main-background">
              <div className="md-heading">
                <span>
                  <CrownOutlined />
                  {' '}
                  {total}
                  {' '}
                  Content Creators
                </span>
                <span className="sort-model">
                  <DropOption
                    menuOptions={[
                      { key: 'latest', name: 'Latest' },
                      { key: 'oldest', name: 'Oldest' },
                      { key: 'popular', name: 'Popular' }
                    ]}
                    onMenuClick={(v: string) => this.handleSort(v)}
                  />
                </span>
              </div>
              <Row>
                {performers && performers.length > 0
                    && !isLoading
                    && performers.map((p: any) => (
                      <Col xs={12} sm={12} md={8} lg={8} key={p._id}>
                        <PerformerCard performer={p} />
                      </Col>
                    ))}

              </Row>
              {!total && !isLoading && <p>No content creator found.</p>}
              {isLoading && (
                <div className="text-center">
                  <Spin />
                </div>
              )}
              {total && total > limit && !isLoading ? (
                <div className="paging">
                  <Pagination
                    showQuickJumper
                    defaultCurrent={offset + 1}
                    total={total}
                    pageSize={limit}
                    onChange={this.pageChanged}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </Layout>
      </>
    );
  }
}

const mapStates = (state: any) => ({
  performerState: { ...state.performer.performerListing },
  ui: { ...state.ui }
});

const mapDispatch = { getList };
export default connect(mapStates, mapDispatch)(Performers);
