'use client';

import React from 'react';
import {requester, SurveyViewer} from '@axelor/react-survey-components';

const Content = ({survey, response}: {survey: any; response?: any}) => {
  const {config, themeConfig} = survey;

  requester.registerConfig(process.env.NEXT_PUBLIC_AOS_URL ?? '', {
    username: process.env.BASIC_AUTH_USERNAME ?? '',
    password: process.env.BASIC_AUTH_PASSWORD ?? '',
  });

  return (
    <SurveyViewer
      config={config}
      theme={themeConfig}
      response={response}
      readonly={response != null && !survey.canAnswerBeModified}
    />
  );
};
export default Content;
