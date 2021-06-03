import {
  Layout,
  message,
  Select,
  Button,
  PageHeader,
  Row,
  Col,
  Input,
  Space,
  Statistic,
  Alert,
  Tag
} from 'antd';
import Head from 'next/head';
import { PureComponent } from 'react';
import { IPayoutRequest } from 'src/interfaces';
import { BreadcrumbComponent } from '@components/common/breadcrumb';
import Page from '@components/common/layout/page';
import { payoutRequestService } from 'src/services';
import Router from 'next/router';
import { getResponseError } from '@lib/utils';
import { formatDate } from 'src/lib/date';

const { Content } = Layout;

interface IProps {
  id: string;
}

interface IStates {
  request: IPayoutRequest;
  loading: boolean;
  status: string;
  adminNote: any;
  statsPayout: {
    totalEarnedTokens: number;
    previousPaidOutTokens: number;
    remainingUnpaidTokens: number;
  }
}

class PayoutDetailPage extends PureComponent<IProps, IStates> {
  static async getInitialProps({ ctx }) {
    return ctx.query;
  }

  constructor(props: IProps) {
    super(props);
    this.state = {
      request: null,
      loading: true,
      status: '',
      adminNote: '',
      statsPayout: {
        totalEarnedTokens: 0,
        previousPaidOutTokens: 0,
        remainingUnpaidTokens: 0
      }
    };
  }

  componentDidMount() {
    this.getData();
  }

  async onUpdate() {
    const { status, adminNote, request } = this.state;
    try {
      await this.setState({ loading: true });
      if (status === 'done' && request.paymentAccountType === 'stripe') {
        await payoutRequestService.payout(request._id);
      }
      await payoutRequestService.update(request._id, {
        status,
        adminNote
      });
      message.success('Updated successfully');
      Router.replace('/payout-request');
    } catch (e) {
      const err = await Promise.resolve(e);
      message.error(getResponseError(err), 10);
    } finally {
      this.setState({ loading: false });
    }
  }

  async getData() {
    const { id } = this.props;
    try {
      await this.setState({ loading: true });
      const resp = await payoutRequestService.findById(id);
      this.getStatsPayout(resp.data.sourceId);
      await this.setState({
        request: resp.data,
        status: resp.data.status,
        adminNote: resp.data.adminNote
      });
    } catch (e) {
      const err = await Promise.resolve(e);
      message.error(getResponseError(err));
    } finally {
      this.setState({ loading: false });
    }
  }

  async getStatsPayout(performerId: string) {
    try {
      const resp = await payoutRequestService.calculate({
        performerId
      });
      this.setState({
        statsPayout: resp.data
      });
    } catch (e) {
      const err = await Promise.resolve(e);
      message.error(getResponseError(err));
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    const {
      request, adminNote, loading, statsPayout
    } = this.state;
    const paymentAccountInfo = request?.paymentAccountInfo;
    return (
      <Layout>
        <Head>
          <title>Request Details</title>
        </Head>
        <Content>
          <div className="main-container">
            <BreadcrumbComponent
              breadcrumbs={[
                { title: 'Payout Requests', href: '/payout-request' },
                {
                  title: 'Request Details'
                }
              ]}
            />
            {request ? (
              <Page>
                <PageHeader title="Request informations" />
                <Row>
                  <Col span={24}>
                    <div style={{ margin: '20px 0', textAlign: 'center', width: '100%' }}>
                      <Space size="large">
                        <Statistic
                          prefix={<img src="/coin-ico.png" alt="coin" width="20px" />}
                          title="Total Earned Tokens"
                          value={statsPayout?.totalEarnedTokens || 0}
                          precision={2}
                        />
                        <Statistic
                          prefix={<img src="/coin-ico.png" alt="coin" width="20px" />}
                          title="Previous paid out tokens"
                          value={statsPayout?.previousPaidOutTokens || 0}
                          precision={2}
                        />
                        <Statistic
                          prefix={<img src="/coin-ico.png" alt="coin" width="20px" />}
                          title="Remaining unpaid tokens"
                          value={statsPayout?.remainingUnpaidTokens || 0}
                          precision={2}
                        />
                      </Space>
                    </div>
                  </Col>
                  <Col md={12} lg={12} xs={24}>
                    <p>
                      Model:
                      {' '}
                      <strong>{request?.sourceInfo?.name || request?.sourceInfo?.username || 'N/A'}</strong>
                    </p>
                    <p>
                      Requested tokens:
                      {' '}
                      {request.requestTokens || 0}
                    </p>
                    <p>
                      Requested at:
                      {' '}
                      {formatDate(request.createdAt)}
                    </p>
                    <p>
                      User Note:
                      {' '}
                      {request.requestNote && <Alert message={request.requestNote} />}
                    </p>
                  </Col>

                  <Col md={12} lg={12} xs={24}>
                    <p>
                      Payout payment gateway:
                      {' '}
                      <Tag style={{ textTransform: 'capitalize' }} color="cyan">{request.paymentAccountType}</Tag>
                    </p>
                    {request.paymentAccountType === 'paypal' && (
                    <>
                      <h4>Paypal Informations</h4>
                      <p>
                        Email address:
                        {' '}
                        {paymentAccountInfo?.value?.email || 'N/A'}
                      </p>
                      <p>
                        Phone number:
                        {' '}
                        {paymentAccountInfo?.value?.phoneNumber || 'N/A'}
                      </p>
                    </>
                    )}
                  </Col>
                  <Col md={24} lg={24}>
                    <div style={{ marginBottom: '10px' }}>
                      <p>
                        Update status here:
                      </p>
                      {request.paymentAccountType === 'stripe' && <p style={{ color: 'red' }}><small>Once you select to Done, system is going to payout via Stripe Connect</small></p>}
                      <Select
                        disabled={loading || ['done', 'rejected'].includes(request?.status)}
                        style={{ width: '100%' }}
                        onChange={(e) => this.setState({ status: e })}
                        defaultValue={request.status || 'N/A'}
                      >
                        {/* <Select.Option key="approved" value="approved">
                          Approved
                        </Select.Option> */}
                        <Select.Option key="pending" value="pending" disabled>
                          Pending
                        </Select.Option>
                        <Select.Option key="rejected" value="rejected">
                          Rejected
                        </Select.Option>
                        <Select.Option key="done" value="done">
                          Done
                        </Select.Option>
                      </Select>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                      <p>Note to user: </p>
                      <Input.TextArea
                        defaultValue={adminNote}
                        style={{ width: '100%' }}
                        onChange={(v) => {
                          this.setState({ adminNote: v.target.value });
                        }}
                        placeholder="Text something to user"
                        autoSize={{ minRows: 3 }}
                      />
                    </div>
                  </Col>
                </Row>
                <div style={{ marginBottom: '10px', display: 'flex' }}>
                  <Button
                    type="primary"
                    onClick={this.onUpdate.bind(this)}
                  >
                    Update
                  </Button>
                  &nbsp;
                  <Button
                    type="default"
                    onClick={() => Router.back()}
                  >
                    Back
                  </Button>
                </div>
              </Page>
            ) : (
              <p>Request not found.</p>
            )}
          </div>
        </Content>
      </Layout>
    );
  }
}

export default PayoutDetailPage;
