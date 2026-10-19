import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('TECHORA Portal Runtime Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--mist)',
            padding: '24px',
          }}
        >
          <div
            style={{
              maxWidth: '540px',
              width: '100%',
              backgroundColor: 'var(--white)',
              borderRadius: '8px',
              border: '1px solid var(--line)',
              boxShadow: '0 10px 30px rgba(11, 31, 58, 0.08)',
              padding: '36px 32px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#FEF2F2',
                color: '#DC2626',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                fontSize: '24px',
              }}
            >
              ⚠
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.4rem',
                color: 'var(--navy-900)',
                margin: '0 0 10px',
              }}
            >
              Institutional Portal Notice
            </h2>

            <p style={{ fontSize: '0.875rem', color: 'var(--ink)', lineHeight: 1.6, marginBottom: '24px' }}>
              The portal encountered an unexpected display condition. Our system state has been preserved. Please refresh the interface to reinitialize your session.
            </p>

            {this.state.error && (
              <div
                style={{
                  textAlign: 'left',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '4px',
                  padding: '12px',
                  marginBottom: '24px',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  color: '#475569',
                  overflowX: 'auto',
                }}
              >
                {this.state.error.toString()}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={this.handleReload}
                className="btn-navy"
                style={{ padding: '10px 24px', fontSize: '0.875rem' }}
              >
                Reload Interface
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'var(--mist)',
                  border: '1px solid var(--line)',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--navy-900)',
                  cursor: 'pointer',
                }}
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
