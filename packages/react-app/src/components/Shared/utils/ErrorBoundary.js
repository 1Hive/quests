import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import React from 'react';

Sentry.init({
  dsn: 'https://331a9ba277c0463ebfa17c3af2b2f731@o606795.ingest.sentry.io/5745163',
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0,
});

Sentry.configureScope((scope) => {
  scope.setLevel(Sentry.Severity.Warning);
});

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error) {
    Sentry.captureException(error, {
      level: Sentry.Severity.Error,
    });
  }

  render() {
    if (this.state.hasError) {
      // // You can render any custom fallback UI
      // const toast = useToast();
      // toast('Oops, Something went wrong !');
    }

    return this.props.children;
  }
}
