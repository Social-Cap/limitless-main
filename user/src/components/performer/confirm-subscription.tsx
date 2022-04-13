/* eslint-disable no-nested-ternary */
import { PureComponent } from 'react';
import {
  Button, Avatar, Radio, Space
} from 'antd';
import { IPerformer } from 'src/interfaces';
import {
  CheckSquareOutlined
} from '@ant-design/icons';
import { TickIcon } from 'src/icons';
import './performer.less';

interface IProps {
  type: string;
  performer: IPerformer;
  onFinish: Function;
  submiting: boolean;
}

export class ConfirmSubscriptionPerformerForm extends PureComponent<IProps> {
  state = {
    gateway: 'ccbill'
  }

  render() {
    const {
      onFinish, submiting = false, performer, type
    } = this.props;
    const { gateway } = this.state;
    return (
      <div className="confirm-subscription-form">
        <div className="text-center">
          <h3 className="secondary-color">
            Confirm
            {' '}
            {type}
            {' '}
            subscription with
            {' '}
            {performer?.name || performer?.username || 'the model'}
          </h3>
          <Avatar src={performer?.avatar || '/static/no-avatar.png'} />
          <p className="p-name">
            {performer?.name || performer?.username || 'N/A'}
            {' '}
            {performer?.verifiedAccount && <TickIcon className="primary-color" />}
          </p>
        </div>
        <div className="info-body">
          <p>
            SUBSCRIBE TO GET THESE BENEFITS
          </p>
          <ul>
            <li>
              <CheckSquareOutlined />
              {' '}
              Full access to this model&apos;s content
            </li>
            <li>
              <CheckSquareOutlined />
              {' '}
              Direct message with this model
            </li>
            <li>
              <CheckSquareOutlined />
              {' '}
              Cancel your subscription at any time
            </li>
          </ul>
          <div className="text-center" style={{ margin: '10px 0' }}>
            <Radio.Group onChange={(e) => this.setState({ gateway: e.target.value })} value={gateway}>
              <Space size="large">
                <Radio value="stripe" key="stripe">
                  <img src="/static/stripe-icon.jpeg" height="40px" alt="stripe" />
                </Radio>
                <Radio value="ccbill" key="ccbill">
                  <img src="/static/ccbill-ico.png" height="40px" alt="ccbill" />
                </Radio>
              </Space>
            </Radio.Group>
          </div>
        </div>
        <Button
          className="primary"
          disabled={submiting}
          loading={submiting}
          onClick={() => onFinish(gateway)}
          style={{ textTransform: 'uppercase', whiteSpace: 'pre-wrap', height: 'auto' }}
        >
          Confirm
          {' '}
          {type}
          {' '}
          subscription
          {' '}
          for
          {' '}
          {type === 'monthly' ? `$${(performer?.monthlyPrice || 0).toFixed(2)}` : type === 'yearly' ? `$${(performer?.yearlyPrice || 0).toFixed(2)}` : `${performer?.durationFreeSubscriptionDays} day${performer?.durationFreeSubscriptionDays > 1 ? 's' : ''}`}
        </Button>
      </div>
    );
  }
}
