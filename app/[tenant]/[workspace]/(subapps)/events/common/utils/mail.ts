// ---- CORE IMPORTS ---- //
import {Participant} from '@/types';

export function mailTemplate({
  event,
  participant,
}: {
  event: any;
  participant: Participant;
}) {
  const {
    eventTitle,
    eventPlace,
    eventAllDay,
    formattedEventStartDateTime,
    formattedEventEndDateTime,
    eventDescription,
  } = event;

  const {name, surname, subscriptionSet = []} = participant;
  const fullName = `${name} ${surname}`.trim();

  const dateDetails = eventAllDay
    ? `<strong>Date:</strong> ${formattedEventStartDateTime}`
    : `<strong>Date:</strong> ${formattedEventStartDateTime} - ${formattedEventEndDateTime}`;

  const subscriptionDetails = subscriptionSet?.length
    ? subscriptionSet
        .map((subscription: any) => `<li>${subscription.facility}</li>`)
        .join('')
    : null;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f9f9f9;
          color: #333;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background: #5603AD;
          color: #fff;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
          line-height: 1.6;
        }
        .facilities-title {
          margin: 0;
        }
        .facility-list {
          margin: 0;
          padding-left: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to the Event!</h1>
        </div>
        <div class="content">
          <p>Hi <b>${fullName}</b>,</p>
          <p>Thank you for registering for our upcoming event. Here are the details:</p>
          <p>
            <strong>Event Name:</strong> ${eventTitle}<br>
            ${dateDetails}<br>
            ${eventPlace ? `<strong>Location:</strong> ${eventPlace}` : ''}
          </p>
          ${
            subscriptionDetails
              ? `<p class="facilities-title"><strong>Facilities:</strong></p>
                  <ul class="facility-list">${subscriptionDetails}</ul>`
              : ''
          }
          ${eventDescription ? `<p>${eventDescription}</p>` : ''}
          <p>We look forward to seeing you there!</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
