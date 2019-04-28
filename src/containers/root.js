import React from 'react';

import AppContext from '../contexts/app';
import {useRouter} from '../hooks/router';
// Screens
import ErrorScreen from '../screens/ErrorScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import HomeScreen from '../screens/HomeScreen';
import BuilderScreen from '../screens/BuilderScreen';

const screens = {
  home: HomeScreen,
  builder: BuilderScreen,
  notFound: NotFoundScreen,
};

export function Router() {
  const [screen, params] = useRouter();

  if (screen in screens) {
    const Component = screens[screen];
    return <Component params={params} />;
  } else if (screen !== null) {
    return (
      <ErrorScreen>
        <p>
          Screen <strong>{screen}</strong> is requested but not defined.
        </p>
      </ErrorScreen>
    );
  } else {
    return null;
  }
}

class ErrorBoundary extends React.Component {
  state = {hasError: false};
  static getDerivedStateFromError(error) {
    return {hasError: true};
  }

  componentDidCatch(err, info) {
    this.props.logger.error('uncaught_error', {err, info});
  }

  render() {
    if (this.state.hasError) {
      return <ErrorScreen />;
    }

    return this.props.children;
  }
}

export default function Root({app}) {
  return (
    <ErrorBoundary logger={app.scope.logger.child('view')}>
      <AppContext.Provider value={app}>
        <Router />
      </AppContext.Provider>
    </ErrorBoundary>
  );
}
