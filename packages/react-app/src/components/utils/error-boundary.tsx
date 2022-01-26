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
  state = { hasError: false };

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    Logger.exception(error, 'An error occured at the top level');
    this.setState({ hasError: true });
  }

  render() {
    const { hasError } = this.state;
    if (hasError) {
      const { toast } = this.props;
      toast('💣️ Oops. Something went wrong');
    }
    const { children } = this.props;
    return children;
  }
}

export default withToast(ErrorBoundary);
