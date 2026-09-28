// @ts-check
import { renderLegal } from './_legal.js';

const DISCLAIMER = [
  {
    h: 'General awareness only',
    p: [
      'The information on this website is provided for general awareness, contact and appointment purposes. It should not be used as a substitute for professional medical advice, diagnosis or treatment.',
    ],
  },
  {
    h: 'Services and facilities',
    p: [
      'Lists of services, departments and facilities are only shown once confirmed by the clinic. Until they are confirmed, websites pages will state that information is being updated.',
      'Nothing on this website should be read as a guarantee of any specific service, treatment or outcome.',
    ],
  },
  {
    h: 'Appointments',
    p: [
      'Online appointment requests require confirmation by the clinic. Always confirm your appointment directly with the clinic before attending.',
    ],
  },
  {
    h: 'Emergencies',
    p: [
      'If you are experiencing a medical emergency, do not use this website. Seek appropriate emergency medical assistance immediately.',
    ],
  },
  {
    h: 'Accuracy',
    p: [
      'Every effort is made to keep website details current and accurate, but information such as opening hours and contact details may change. Please verify details with the clinic directly.',
    ],
  },
];

export function render() {
  return renderLegal({
    path: '/medical-disclaimer',
    title: 'Medical Disclaimer | Samasi Rangitatu Polyclinic',
    description: 'Medical disclaimer for the Samasi Rangitatu Polyclinic website.',
    active: '',
    eyebrow: 'Legal',
    sections: DISCLAIMER,
  });
}