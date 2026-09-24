// @ts-check
import { renderLegal } from './_legal.js';

const PRIVACY = [
  {
    h: 'What this policy covers',
    p: [
      'This page explains how information you provide through this website is handled. The website is operated for Samasi Rangitatu Polyclinic to help patients find, contact and reach the clinic.',
    ],
  },
  {
    h: 'Information collected',
    p: [
      'This website can collect the information you choose to provide through its contact and appointment-request forms, such as your name, phone number, optional email address, preferred date and time, and any short message you type.',
      'In an appointment request, the clinical service (if one is selected) and the reason for your visit may also be included. You are asked not to share unnecessary sensitive medical details in these forms.',
    ],
  },
  {
    h: 'How information is used',
    p: [
      'Information is used only to respond to your enquiry and to arrange or confirm an appointment with the clinic. It is not published, and it is not sold or shared for marketing purposes.',
    ],
  },
  {
    h: 'Retention',
    p: [
      'Submitted information is kept only as long as needed to respond to you and to operate the clinic services described on this website, or as required by applicable law.',
    ],
  },
  {
    h: 'Online appointment requests',
    p: [
      'Submitting an appointment request does not confirm an appointment. The clinic contacts you to confirm before any visit is arranged.',
    ],
  },
  {
    h: 'Third parties',
    p: [
      'The website does not knowingly pass your form information to any third party. If a third-party service is used in the future to receive form submissions, it will be disclosed in this policy before use.',
      'This website references the clinic\u2019s public Google listing for rating and hours information. Check that listing for its own privacy terms.',
    ],
  },
];

export function render() {
  return renderLegal({
    path: '/privacy',
    title: 'Privacy Policy | Samasi Rangitatu Polyclinic',
    description: 'How Samasi Rangitatu Polyclinic handles information submitted through this website.',
    active: '',
    eyebrow: 'Legal',
    sections: PRIVACY,
  });
}