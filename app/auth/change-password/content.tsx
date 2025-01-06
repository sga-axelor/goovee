'use client';

import React, {useState} from 'react';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/locale';
import {StyledAlert, TextField, Button} from '@/ui/components';

export default function Content() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword(show => !show);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(show => !show);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <div className="mx-auto p-4 sm:p-6 max-w-[74.0625rem] w-full">
      <h5 className="mb-3 font-medium text-xl">{i18n.t('Change password')}</h5>
      <form
        className="bg-card text-card-foreground rounded-lg py-4 px-6 sm:px-4 grid grid-cols-1 gap-4"
        onSubmit={handleSubmit}>
        <div>
          <TextField
            label={i18n.t('New Password')}
            name="password"
            placeholder="Password"
            type={showPassword ? 'text' : 'password'}
            icons={[
              {
                icon: showPassword
                  ? 'MdOutlineVisibility'
                  : 'MdOutlineVisibilityOff',
                onClick: toggleShowPassword,
              },
            ]}
          />
          <TextField
            label={i18n.t('Confirm Password')}
            name="confirmPassword"
            placeholder="Password"
            type={showConfirmPassword ? 'text' : 'password'}
            icons={[
              {
                icon: showConfirmPassword
                  ? 'MdOutlineVisibility'
                  : 'MdOutlineVisibilityOff',
                onClick: toggleShowConfirmPassword,
              },
            ]}
          />
          <Button type="submit" className="rounded-full">
            {i18n.t('Submit')}
          </Button>
        </div>
        <StyledAlert
          variant="error"
          show={true}
          heading={i18n.t('Your passwords do not match, please try again.')}
          description={i18n.t(
            'The description line of a sticky alert. Helpful component that is designed to be placed near to alert context.',
          )}
        />
        <StyledAlert
          variant="success"
          show={true}
          heading={i18n.t('Your password has been successfully updated.')}
          description={i18n.t('Add text here if necessary.')}
        />
      </form>
    </div>
  );
}
