import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import React from 'react';

Sentry.init({
  dsn: '[DSN]', // TODO : Get it from https://sentry.io/settings/1hive/projects/quests-4u/keys/
  integrations: [new Integrations.BrowserTracing()],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0,
});
Sentry.configureScope((scope) => {
  scope.setLevel(Sentry.Severity.Warning);
});

type Props = {
  children: React.ReactNode;
};

export default class ErrorBoundary extends React.Component<Props> {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // TODO : Restore when https://app.zenhub.com/workspaces/quests-6092dda4c272a5000e858266/issues/1hive/quests/108
    // Sentry.captureException(error, {
    //   level: Sentry.Severity.Error,
    // });
  }

  render() {
    const { hasError } = this.state;
    if (hasError) {
      // // You can render any custom fallback UI
      // const toast = useToast();
      // toast('Oops, Something went wrong !');
    }
    const { children } = this.props;
    return children;
  }
}
