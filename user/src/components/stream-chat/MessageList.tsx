import { PureComponent, createRef } from 'react';
import { Spin } from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  loadMoreStreamMessages,
  receiveStreamMessageSuccess,
  deleteMessage,
  deleteMessageSuccess
} from '@redux/stream-chat/actions';
import { Event } from 'src/socket';
import { IUser } from 'src/interfaces';
import '@components/messages/MessageList.less';
import StreamChatCompose from './Compose';
import Message from './Message';

interface IProps {
  sendMessage: any;
  loadMoreStreamMessages: Function;
  receiveStreamMessageSuccess: Function;
  message: any;
  conversation: any;
  user: IUser;
  deleteMessage: Function;
  deleteMessageSuccess: Function;
}

interface IUserJoinedChat {
  user: IUser;
  role: 'member' | 'model',
  conversationId: string
}

class MessageList extends PureComponent<IProps> {
  messagesRef: any;

  state = {
    offset: 0
  };

  async componentDidMount() {
    if (!this.messagesRef) this.messagesRef = createRef();
  }

  async componentDidUpdate(prevProps) {
    const { message, sendMessage } = this.props;
    if ((prevProps.message.total === 0 && message.total !== 0) || (prevProps.message.total === message.total)) {
      if (prevProps.sendMessage?.data?._id !== sendMessage?.data?._id) {
        this.scrollToBottom(true);
        return;
      }
      this.scrollToBottom(false);
    }
  }

  async handleScroll(conversation, event) {
    const {
      message: { fetching, items, total },
      loadMoreStreamMessages: loadMore
    } = this.props;
    const { offset } = this.state;
    const canloadmore = total > items.length;
    const ele = event.target;
    if (!canloadmore) return;
    if (ele.scrollTop === 0 && conversation._id && !fetching && canloadmore) {
      await this.setState({ offset: offset + 1 });
      loadMore({
        conversationId: conversation._id,
        limit: 25,
        offset: (offset + 1) * 25,
        type: conversation.type
      });
    }
  }

  onDelete(messageId: string) {
    const { deleteMessage: _deleteMessage } = this.props;
    if (!messageId) return;
    _deleteMessage({ messageId });
  }

  renderMessages = () => {
    const { message, conversation, user } = this.props;
    const messages = message.items;
    let i = 0;
    const messageCount = messages && messages.length;
    const tempMessages = [];
    while (i < messageCount) {
      const previous = messages[i - 1];
      const current = messages[i];
      const next = messages[i + 1];
      const isMine = current?.senderId === user?._id;
      const currentMoment = moment(current.createdAt);
      let prevBySameAuthor = false;
      let nextBySameAuthor = false;
      let startsSequence = true;
      let endsSequence = true;
      let showTimestamp = false;
      if (previous) {
        const previousMoment = moment(previous.createdAt);
        const previousDuration = moment.duration(
          currentMoment.diff(previousMoment)
        );
        prevBySameAuthor = previous.senderId === current.senderId;

        if (prevBySameAuthor && previousDuration.as('hours') < 1) {
          startsSequence = false;
        }
      }

      if (previous && moment(current.createdAt).startOf('days').diff(moment(previous.createdAt).startOf('days')) > 0) {
        showTimestamp = true;
      }

      if (next) {
        const nextMoment = moment(next.createdAt);
        const nextDuration = moment.duration(nextMoment.diff(currentMoment));
        nextBySameAuthor = next.senderId === current.senderId;

        if (nextBySameAuthor && nextDuration.as('hours') < 1) {
          endsSequence = false;
        }
      }
      if (current._id) {
        tempMessages.push(
          <Message
            onDelete={() => this.onDelete(current._id)}
            isOwner={conversation.performerId === current.senderId}
            key={current.isDeleted ? `${current._id}_deleted_${i}` : `${current._id}_${i}`}
            isMine={isMine}
            startsSequence={startsSequence}
            endsSequence={endsSequence}
            showTimestamp={showTimestamp}
            data={current}
          />
        );
      }
      // Proceed to the next message.
      i += 1;
    }
    return tempMessages;
  };

  onMessage = (type, message) => {
    if (!message) {
      return;
    }
    const { receiveStreamMessageSuccess: create, deleteMessageSuccess: remove } = this.props;
    type === 'created' && create(message);
    type === 'deleted' && remove(message);
  };

  onUserJoined = ({ user, role, conversationId }: IUserJoinedChat) => {
    // TODO display something
    console.log(`${user?.name || user?.username} joined chat`);
  }

  scrollToBottom(toBot = true) {
    const { message: { fetching } } = this.props;
    const { offset } = this.state;
    if (!fetching && this.messagesRef && this.messagesRef.current) {
      const ele = this.messagesRef.current;
      window.setTimeout(() => {
        ele.scrollTop = toBot ? ele.scrollHeight : (ele.scrollHeight / (offset + 1) - 150);
      }, 300);
    }
  }

  render() {
    const { conversation } = this.props;
    const {
      message: { fetching = false, items = [] }
    } = this.props;
    if (!this.messagesRef) this.messagesRef = createRef();
    return (
      <div
        className="message-list"
        ref={this.messagesRef}
        onScroll={this.handleScroll.bind(this, conversation)}
      >
        <Event event={`message_created_conversation_${conversation._id}`} handler={this.onMessage.bind(this, 'created')} />
        <Event event={`message_deleted_conversation_${conversation._id}`} handler={this.onMessage.bind(this, 'deleted')} />
        <Event event={`user_joined_${conversation._id}`} handler={this.onUserJoined.bind(this)} />
        {conversation && conversation._id && (
          <>
            <div className="message-list-container">
              {fetching && <div className="text-center" style={{ marginTop: '50px' }}><Spin /></div>}
              {this.renderMessages()}
              {!fetching && !items.length && <p className="text-center">Let&apos;s start talking something</p>}
            </div>
            <StreamChatCompose conversation={conversation} />
          </>
        )}
      </div>
    );
  }
}

const mapStates = (state: any) => {
  const { conversationMap, activeConversation, sendMessage } = state.streamMessage;
  const messages = activeConversation.data && conversationMap[activeConversation.data._id]
    ? conversationMap[activeConversation.data._id].items || []
    : [];
  const totalMessages = activeConversation.data && conversationMap[activeConversation.data._id]
    ? conversationMap[activeConversation.data._id].total || 0
    : 0;
  const fetching = activeConversation.data && conversationMap[activeConversation.data._id]
    ? conversationMap[activeConversation.data._id].fetching || false
    : false;
  return {
    sendMessage,
    message: {
      items: messages,
      total: totalMessages,
      fetching
    },
    conversation: activeConversation.data,
    user: state.user.current
  };
};

const mapDispatch = {
  loadMoreStreamMessages,
  receiveStreamMessageSuccess,
  deleteMessage,
  deleteMessageSuccess
};
export default connect(mapStates, mapDispatch)(MessageList);
