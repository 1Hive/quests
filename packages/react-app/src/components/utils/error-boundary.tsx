import { useToast } from '@1hive/1hive-ui';
import React from 'react';
import { Logger } from 'src/utils/logger';

function withToast(Component: any) {
  return function WrappedComponent(props: any) {
    const toast = useToast();
    return <Component {...props} toast={toast} />;
  };
}

type Props = {
  children: React.ReactNode;
  toast: Function;
};

class ErrorBoundary extends React.Component<Props> {
  state: { hasError: boolean; error?: string | Error } = { hasError: false };

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    const { error: stateError } = this.state;
    if (!error || stateError === error) return;
    Logger.exception(error, 'An error occured at the top level');
    this.setState({ hasError: true, error });
  }

  render() {
    try {
      const { hasError, error } = this.state;
      if (hasError && error && !error.toString().includes('Unknown chain id')) {
        const { toast } = this.props;
        toast?.('💣️ Oops. Something went wrong');
      }
    } catch (error) {
      Logger.exception(error, 'An error occured while trying to show the toast');
    }
    const { children } = this.props;
    return children;
  }
}

export default withToast(ErrorBoundary);
