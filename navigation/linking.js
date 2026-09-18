const linking = {
  prefixes: [],
  config: {
    screens: {
      Home: '',
      Work: {
        path: 'work',
        initialRouteName: 'WorkOverview',
        screens: {
          WorkOverview: '',
          WorkDetail: ':slug',
        },
      },
      Posts: 'posts',
    },
  },
};

export default linking;
