'use client';

import React from 'react';
import {SurveyViewer} from '@axelor/react-survey-components';

const Content = ({survey, response}: {survey: any; response?: any}) => {
  const {config, theme} = survey;

  return (
    <SurveyViewer
      config={config}
      theme={theme}
      isReadOnly={false}
      response={response}
    />
  );
};
export default Content;
