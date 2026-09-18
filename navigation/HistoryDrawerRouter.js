import { DrawerRouter } from '@react-navigation/native';

// React Navigation 6's "history" mode removes earlier visits to a route.
// Keep those visits on web so useLinking pushes a browser entry on every move.
export default function HistoryDrawerRouter(options) {
  const router = DrawerRouter({ ...options, backBehavior: 'history' });

  function keepVisits(state, nextState) {
    if (!nextState) return nextState;

    const history = state.history.filter(entry => entry.type === 'route');
    const key = nextState.routes[nextState.index].key;

    if (history[history.length - 1]?.key !== key) {
      history.push({ type: 'route', key });
    }

    return {
      ...nextState,
      history: history.concat(nextState.history.filter(entry => entry.type !== 'route')),
    };
  }

  return {
    ...router,
    getStateForAction(state, action, options) {
      const nextState = router.getStateForAction(state, action, options);
      return action.type === 'NAVIGATE' || action.type === 'JUMP_TO'
        ? keepVisits(state, nextState)
        : nextState;
    },
    getStateForRouteFocus(state, key) {
      return keepVisits(state, router.getStateForRouteFocus(state, key));
    },
  };
}
