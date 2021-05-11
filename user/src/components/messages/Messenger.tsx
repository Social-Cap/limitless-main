import { PureComponent } from 'react';
import { connect } from 'react-redux';
import { deactiveConversation } from '@redux/message/actions';
import { Button } from 'antd';
import { CloseSquareOutlined } from '@ant-design/icons';
import ConversationList from './ConversationList';
import MessageList from './MessageList';
import './Messenger.less';

interface IProps {
  toSource?: string;
  toId?: string;
  activeConversation?: any;
  deactiveConversation: Function;
}
class Messenger extends PureComponent<IProps> {
  componentDidMount() {
    const { toSource, toId, deactiveConversation: handleDeactive } = this.props;
    if (!toSource && !toId) {
      handleDeactive();
    }
  }

  onClose() {
    const { deactiveConversation: handleDeactive } = this.props;
    handleDeactive();
  }

  render() {
    const { toSource, toId, activeConversation } = this.props;
    return (
      <div className="messenger">
        <div className={!activeConversation._id ? 'sidebar' : 'sidebar active'}>
          <ConversationList toSource={toSource} toId={toId} />
        </div>
        <div className={!activeConversation._id ? 'chat-content' : 'chat-content active'}>
          <Button type="link" onClick={this.onClose.bind(this)} className="close-btn"><CloseSquareOutlined /></Button>
          <MessageList />
        </div>
      </div>
    );
  }
}
const mapStates = (state: any) => {
  const { activeConversation } = state.conversation;
  return {
    activeConversation
  };
};

const mapDispatch = { deactiveConversation };
export default connect(mapStates, mapDispatch)(Messenger);
