/* eslint-disable no-template-curly-in-string */
import { PureComponent } from 'react';
import {
  Form, DatePicker, Button, Checkbox
} from 'antd';
import { IPerformerUpdate, ISchedule } from 'src/interfaces';
import moment from 'moment';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

const validateMessages = {
  required: 'This field is required!',
  types: {
    email: 'Not a validate email!',
    number: 'Not a validate number!'
  },
  number: {
    range: 'Must be between ${min} and ${max}'
  }
};

interface IProps {
  performer?: IPerformerUpdate;
  onFinish?: Function;
  onFormRefSubmit?: Function;
  submiting: boolean;
  onChangeTime: Function;
  scheduleValue: ISchedule;
  onChangeCloded: Function;
}

export class PerformerSchedule extends PureComponent<IProps> {
  render() {
    const {
      onFormRefSubmit,
      submiting,
      onChangeTime,
      scheduleValue,
      onChangeCloded
    } = this.props;
    const dayValue = {
      mon: {
        day: 'Monday'
      },
      tue: {
        day: 'Tuesday'
      },
      wed: {
        day: 'Wednesday'
      },
      thu: {
        day: 'Thursday'
      },
      fri: {
        day: 'Friday'
      },
      sat: {
        day: 'Saturday'
      },
      sun: {
        day: 'Sunday'
      }
    };
    const format = 'HH:mm';
    const { RangePicker } = DatePicker;
    return (
      <Form
        {...layout}
        name="form-performer-schedule"
        onFinish={() => onFormRefSubmit()}
        validateMessages={validateMessages}
      >
        {Object.keys(dayValue).map((key) => (
          <Form.Item key={key} label={dayValue[key].day}>
            <RangePicker
              onChange={(dates: any[], dateStrings: [string, string]) => onChangeTime(dates, dateStrings, key)}
              picker="time"
              format={format}
              style={{ marginRight: 10 }}
              defaultValue={[
                moment(scheduleValue[key].start, format),
                scheduleValue[key].end
                  ? moment(scheduleValue[key].end, format)
                  : moment()
              ]}
            />
            <Checkbox
              name={key}
              key={key}
              defaultChecked={scheduleValue[key].closed}
              onChange={(e) => onChangeCloded(e.target.checked, key)}
            >
              Not Available
            </Checkbox>
          </Form.Item>
        ))}
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
          <Button type="primary" htmlType="submit" loading={submiting}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
