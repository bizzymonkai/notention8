import type { OntologyNode } from '../types';

export const DEFAULT_ONTOLOGY: OntologyNode[] = [
  {
    id: 'commerce',
    label: 'Commerce',
    description: 'The activity of buying and selling.',
    children: [
      {
        id: 'product',
        label: 'Product',
        description: 'An item offered for sale.',
        attributes: {
          name: {
            type: 'string',
            description: 'The name of the product.',
            operators: { real: ['is'], imaginary: ['contains', 'is'] },
          },
          description: {
            type: 'string',
            description: 'A description of the product.',
            operators: { real: ['is'], imaginary: ['contains'] },
          },
          price: {
            type: 'number',
            description: 'The price of the product in USD.',
            operators: {
              real: ['is'],
              imaginary: ['<', '>', '=', '<=', '>='],
            },
          },
          category: {
            type: 'enum',
            options: ['Electronics', 'Clothing', 'Books', 'Home Goods', 'Other'],
            description: 'The category of the product.',
            operators: { real: ['is'], imaginary: ['is'] },
          },
          condition: {
            type: 'enum',
            options: ['New', 'Used - Like New', 'Used - Good', 'Used - Fair'],
            description: 'The condition of the product.',
            operators: { real: ['is'], imaginary: ['is'] },
          },
          imageURL: {
            type: 'string',
            description: 'A URL for an image of the product.',
            operators: { real: ['is'], imaginary: [] },
          },
          stock: {
            type: 'number',
            description: 'The number of items in stock.',
            operators: { real: ['is'], imaginary: ['>', '='] },
          },
        },
      },
      {
        id: 'offer',
        label: 'Offer',
        description: 'A note from a seller offering a product for sale.',
        attributes: {
          seller: {
            type: 'string',
            description: 'The profile of the seller.',
            operators: { real: ['is'], imaginary: [] },
          },
        },
      },
      {
        id: 'request',
        label: 'Request',
        description: 'A note from a buyer looking for a product.',
        attributes: {
          buyer: {
            type: 'string',
            description: 'The profile of the buyer.',
            operators: { real: ['is'], imaginary: [] },
          },
        },
      },
    ],
  },
  {
    id: 'profile',
    label: 'Profile',
    description: 'A user profile.',
    attributes: {
      name: {
        type: 'string',
        description: 'The name of the user.',
        operators: { real: ['is'], imaginary: [] },
      },
      avatar: {
        type: 'string',
        description: 'A URL for the user\'s avatar.',
        operators: { real: ['is'], imaginary: [] },
      },
      location: {
        type: 'geo',
        description: 'The location of the user.',
        operators: { real: ['is'], imaginary: ['is near'] },
      },
    },
  },
];
