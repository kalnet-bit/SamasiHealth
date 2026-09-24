// @ts-check
import { renderLegal } from './_legal.js';

const TERMS = [
  {
    h: 'Acceptance of these terms',
    p: [
      'By using this website you agree to these terms of use. If you do not agree, please stop using the site.',
    ],
  },
  {
    h: 'Information accuracy',
    p: [
      'This website presents information about Samasi Rangitatu Polyclinic based on publicly listed details and on information confirmed by the clinic. Information is provided in good faith but may change without notice.',
      'Opening hours and ratings shown here come from a public Google listing at the time the site was prepared. Always confirm hours and availability by calling the clinic.',
    ],
  },
  {
    h: 'Not medical advice',
    p: [
      'The content on this website is for general awareness and appointment purposes only. It does not provide medical advice, diagnosis or treatment. Always consult qualified healthcare staff for medical concerns.',
    ],
  },
  {
    h: 'Appointment requests',
    p: [
      'Submitting an appointment request through this website is a request only. It does not create a confirmed appointment. The clinic contacts you to confirm.',
    ],
  },
  {
    h: 'Emergencies',
    p: [
      'If you are experiencing a medical emergency, seek appropriate emergency medical assistance rather than relying on this website or online forms.',
    ],
  },
  {
    h: 'Use of the website',
    p: [
      'You agree not to misuse the website, including submitting false information, attempting to disrupt the site, or using automated tools in a way that harms clinic services.',
    ],
  },
  {
    h: 'No liability',
    p: [
      'To the fullest extent permitted by law, the clinic is not liable for loss arising from reliance on information on this website. Medical decisions should always be discussed with qualified healthcare professionals.',
    ],
  },
];

export function render() {
  return renderLegal({
    path: '/terms',
    title: 'Terms of Use | Samasi Rangitatu Polyclinic',
    description: 'Terms of use for the Samasi Rangitatu Polyclinic website.',
    active: '',
    eyebrow: 'Legal',
    sections: TERMS,
  });
}