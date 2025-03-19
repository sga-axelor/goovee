'use server';

import {hash} from '@/auth/utils';
import {getTranslation} from '@/locale/server';
import {create as createOTP, findOne, isValid, markUsed} from '@/otp/orm';
import {Scope} from '@/otp/constants';
import {findGooveeUserByEmail, updatePartner} from '@/orm/partner';
import NotificationManager, {NotificationType} from '@/notification';
import {type Tenant} from '@/tenant';

function error(message: string) {
  return {
    error: true,
    message,
  };
}

const resetPasswordTemplate = ({
  email,
  otp,
  link,
}: {
  email: string;
  otp: string;
  link: string;
  subject?: string;
}) => ({
  subject: 'Goovee Password Reset',
  to: email,
  html: otpTemplateHTML({otp, email, link}),
});

const otpTemplateHTML = ({
  otp,
  email,
  link,
}: {
  otp: string;
  email: string;
  link: string;
}) => `
      <!DOCTYPE html>
      <html>
      <head>
          <title>Goovee Password Reset</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  background-color: #f9f9f9;
                  margin: 0;
                  padding: 20px;
              }
              .container {
                  text-align: center;
                  max-width: 600px;
                  margin: 0 auto;
                  background: #ffffff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }
              .header {
                  margin-bottom: 20px;
              }
              .button {
                  display: inline-block;
                  margin: 20px 0;
                  padding: 12px 20px;
                  background-color: #58d59d;
                  color: #ffffff !important;
                  text-decoration: none;
                  border-radius: 5px;
                  font-size: 16px;
              }
              .footer {
                  font-size: 14px;
                  color: #666666;
                  margin-top: 20px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Goovee Password Reset</h1>
              </div>
              <p>Dear User, We’ve received a request to reset the password for your account associated with ${email}. If you requested this change, please follow the instructions below:</p>
              <p>To reset your password, click the link : <a href='${link}' target='_blank'>${link}</a></p>
              <p>Your OTP for password reset is : <strong>${otp}</strong></p>
              <p>This link will expire in 10 minutes, so be sure to reset your password before then.</p>
              <p>If you did not request this change or believe this is a mistake, please ignore this email. Your account remains secure, and no changes will be made.</p>
              <div class="footer">
                  <p>Best regards,<br>The Goovee Team</p>
              </div>
          </div>
      </body>
      </html>
      `;

export async function requestResetPassword({
  email,
  tenantId,
  searchQuery,
}: {
  email: string;
  tenantId: Tenant['id'];
  searchQuery: string;
}) {
  if (!tenantId) {
    return error(await getTranslation({}, 'TenantId is required'));
  }

  if (!email) {
    return error(await getTranslation({tenant: tenantId}, 'Email is required'));
  }

  const user = await findGooveeUserByEmail(email, tenantId);

  const link = `${process.env.NEXT_PUBLIC_HOST}/auth/reset-password/${email}?${searchQuery}`;

  if (!user) {
    return {
      success: true,
      data: {url: link},
    };
  }

  try {
    const result: any = await createOTP({
      entity: email,
      scope: Scope.ResetPassword,
      tenantId,
      force: true,
    });

    const mailService = NotificationManager.getService(NotificationType.mail);

    result?.otp &&
      mailService?.notify(
        resetPasswordTemplate({
          email,
          otp: result.otp,
          link,
        }),
      );

    return {
      success: true,
      data: {
        url: link,
      },
    };
  } catch (err) {
    return error(
      await getTranslation(
        {tenant: tenantId},
        'Error resetting password. Try again.',
      ),
    );
  }
}

export async function resetPassword({
  email,
  otp,
  password,
  tenantId,
}: {
  email: string;
  otp: string;
  password: string;
  tenantId: Tenant['id'];
}) {
  if (!tenantId) {
    return error(await getTranslation({}, 'TenantId is required'));
  }

  if (!(email && password && otp)) {
    return error(
      await getTranslation(
        {tenant: tenantId},
        'Email, password and otp is required',
      ),
    );
  }

  const user = await findGooveeUserByEmail(email, tenantId);

  if (!user) {
    return error(
      await getTranslation({tenant: tenantId}, 'You are not registered'),
    );
  }

  try {
    const result: any = await findOne({
      scope: Scope.ResetPassword,
      entity: email,
      tenantId,
    });

    if (!result) {
      return error(await getTranslation({tenant: tenantId}, 'Bad request'));
    }

    const isValidOTP = await isValid({id: result.id, value: otp, tenantId});

    if (!isValidOTP) {
      return error(await getTranslation({tenant: tenantId}, 'Invalid OTP'));
    }

    const hashedPassword = await hash(password);

    const updatedPartner = await updatePartner({
      data: {
        id: user.id,
        version: user.version,
        password: hashedPassword,
      },
      tenantId,
    });

    await markUsed({id: result.id, tenantId});

    return {
      success: true,
      message: await getTranslation({}, 'Password reset successfully.'),
    };
  } catch (err) {
    return error(
      await getTranslation(
        {tenant: tenantId},
        'Error resetting password. Try again.',
      ),
    );
  }
}
