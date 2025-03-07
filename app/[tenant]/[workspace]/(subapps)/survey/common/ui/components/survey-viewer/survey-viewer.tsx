'use client';

import React, {useEffect} from 'react';
import {SurveyViewer as Viewer} from '@axelor-ent/survey-react-components';

// ---- CORE IMPORTS ---- //
import {PortalWorkspace} from '@/types';
import {useToast} from '@/ui/hooks';
import {i18n} from '@/locale';

// ---- LOCAL IMPORTS ---- //
import {authenticateUser} from '@/subapps/survey/common/action/action';
import {ensureAuth} from '@/subapps/survey/common/utils/auth-helper';

export const SurveyViewer = ({
  survey,
  response,
  partnerId,
  workspace,
}: {
  survey: any;
  response?: any;
  partnerId: number;
  workspace: PortalWorkspace;
}) => {
  const {config, themeConfig} = survey;

  const {toast} = useToast();

  useEffect(() => {
    const authenticate = async () => {
      try {
        if (!workspace) return;

        const result = await authenticateUser({workspace});

        if ('error' in result) {
          toast({
            variant: 'destructive',
            title: i18n.t(result.message || 'Authentication failed'),
          });
        } else {
          await ensureAuth(result);
        }
      } catch (error) {
        console.error('Error during authentication:', error);
        toast({
          variant: 'destructive',
          title: i18n.t('Error during authentication'),
        });
      }
    };

    authenticate();
  }, [toast, workspace]);

  return (
    <Viewer
      config={config}
      theme={themeConfig}
      response={JSON.stringify(response?.attrs)}
      readonly={response != null && !survey.canAnswerBeModified}
      completeData={{
        partnerId,
        configId: survey.id,
        responseId: response?.id,
        responseVersion: response?.version,
        modelName: survey.customModel?.name,
      }}
    />
  );
};

export default SurveyViewer;
