import { Layout, Alert } from 'antd';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import { clearCart } from '@redux/cart/actions';
import { IUser, IUIConfig } from '../../src/interfaces';

interface IProps {
  user: IUser;
  cart: any;
  clearCart: Function;
  ui: IUIConfig
}

class PaymentSuccess extends PureComponent<IProps> {
  static authenticate: boolean = true;

  static noredirect: boolean = true;

  componentDidMount() {
    const { clearCart: handleClearCart, user } = this.props;
    handleClearCart();
    localStorage.setItem(`cart_${user._id}`, JSON.stringify([]));
  }

  render() {
    const { ui, user } = this.props;
    return (
      <Layout>
        <Head>
          <title>
            {ui && ui.siteName}
            {' '}
            | Payment success
          </title>
        </Head>
        <div className="main-container">
          <div className="page-heading">Payment Success</div>
          <Alert
            message="Payment success"
            description={`Hi ${user.name}, your payment has been successfully! Again, thank you for choosing us.`}
            type="success"
            showIcon
          />
        </div>
      </Layout>
    );
  }
}

const mapStates = (state: any) => ({
  user: state.user.current,
  ui: { ...state.ui }
});

const mapDispatch = { clearCart };
export default connect(mapStates, mapDispatch)(PaymentSuccess);
