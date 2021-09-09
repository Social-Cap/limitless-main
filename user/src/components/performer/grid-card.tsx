import { PureComponent } from 'react';
import { IPerformer } from 'src/interfaces';
import Link from 'next/link';
import { StarOutlined } from '@ant-design/icons';
import { dobToAge, shortenLargeNumber } from '@lib/index';
import './performer.less';

interface IProps {
  performer: IPerformer;
}

export default class PerformerGridCard extends PureComponent<IProps> {
  render() {
    const { performer } = this.props;
    return (
      <Link
        href={{
          pathname: '/model/profile',
          query: { username: performer?.username || performer?._id }
        }}
        as={`/${performer?.username || performer?._id}`}
      >
        <a>
          <div className="grid-card" style={{ backgroundImage: `url(${performer?.avatar || '/no-avatar.png'})` }}>
            {performer?.isFreeSubscription && <span className="free-status">Free</span>}
            <div className="card-stat">
              <span>
                {shortenLargeNumber(performer?.score || 0)}
                {' '}
                <StarOutlined />
              </span>
              {performer?.dateOfBirth && (
                <span>
                  {dobToAge(performer?.dateOfBirth)}
                </span>
              )}
            </div>
            <div className="model-name">{performer?.name || performer?.username || 'N/A'}</div>
          </div>
        </a>
      </Link>
    );
  }
}
