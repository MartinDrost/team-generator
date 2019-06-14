const production = {
  api_url: '/api',
};

const development: typeof production = {
  api_url: 'http://localhost:3000/api',
};

export const environment =
  process.env.NODE_ENV === 'production' ? production : development;
