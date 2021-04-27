/* eslint-disable linebreak-style */
/* eslint-disable react/no-unused-state */
/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Head from 'next/head';
import { PureComponent, Fragment, createRef } from 'react';
import { message, Tabs } from 'antd';
import Page from '@components/common/layout/page';
import {
  ICountry, ILangguges, IPerformerCategory, IHeight, IWeight
} from 'src/interfaces';
import Router from 'next/router';
import { performerService } from '@services/index';
import { utilsService } from '@services/utils.service';
import { validateUsername, getResponseError } from '@lib/utils';
import { AccountForm } from '@components/performer/AccountForm';
import { BreadcrumbComponent } from '@components/common';

interface IProps {
  countries: ICountry[];
  languages: ILangguges[];
  categories: IPerformerCategory[];
  heights?: IHeight[];
  weights?: IWeight[];
}
class PerformerCreate extends PureComponent<IProps> {
  static async getInitialProps() {
    const [countries, languages, heights, weights] = await Promise.all([
      utilsService.countriesList(),
      utilsService.languagesList(),
      utilsService.heightList(),
      utilsService.weightList()
      // performerCategoryService.search({
      //   sortBy: 'ordering',
      //   sort: 'asc',
      //   limit: 100
      // })
    ]);
    return {
      countries: countries && countries.data ? countries.data : [],
      languages: languages && languages.data ? languages.data : [],
      heights: heights && heights.data ? heights.data : [],
      weights: weights && weights.data ? weights.data : []
      // categories: categories.data && categories.data.data ? categories.data.data : []
    };
  }

  state = {
    creating: false,
    avatarUrl: '',
    coverUrl: ''
  };

  customFields = {};

  formRef = createRef() as any;

  onUploaded(field: string, resp: any) {
    if (field === 'avatarId') {
      this.setState({ avatarUrl: resp.response.data.url });
    }
    if (field === 'coverId') {
      this.setState({ coverUrl: resp.response.data.url });
    }
    this.customFields[field] = resp.response.data._id;
  }

  async submit(data: any) {
    try {
      if (data.password !== data.rePassword) {
        return message.error('Confirm password mismatch!');
      }

      if (!validateUsername(data.username)) {
        return message.error('Username must contain only Alphabets & Numbers');
      }

      this.setState({ creating: true });
      const resp = await performerService.create({
        ...data,
        ...this.customFields
        // schedule: this.scheduleValue
      });
      message.success('Created successfully');
      Router.push(
        {
          pathname: '/content-creator',
          query: { id: resp.data._id }
        },
        '/content-creator'
      );
    } catch (e) {
      const err = (await Promise.resolve(e)) || {};
      message.error(getResponseError(err) || 'An error occurred, please try again!');
    } finally {
      this.setState({ creating: false });
    }
    return undefined;
  }

  render() {
    const { creating, avatarUrl, coverUrl } = this.state;
    const {
      countries, languages, categories, heights, weights
    } = this.props;
    return (
      <>
        <Head>
          <title>New Content Creator</title>
        </Head>
        <BreadcrumbComponent
          breadcrumbs={[{ title: 'Content Creators', href: '/content-creator' }, { title: 'New content creator' }]}
        />
        <Page>
          <Tabs defaultActiveKey="basic" tabPosition="top">
            <Tabs.TabPane tab={<span>Basic info</span>} key="basic">
              <AccountForm
                ref={this.formRef}
                onUploaded={this.onUploaded.bind(this)}
                onFinish={this.submit.bind(this)}
                submiting={creating}
                countries={countries}
                languages={languages}
                categories={categories}
                heights={heights}
                weights={weights}
                avatarUrl={avatarUrl}
                coverUrl={coverUrl}
              />
            </Tabs.TabPane>
          </Tabs>
        </Page>
      </>
    );
  }
}

export default PerformerCreate;
