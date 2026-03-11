import React from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RotateCcw } from 'lucide-react'

type ErrorBoundaryProps = {
  children: React.ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    // Centralized UI crash logging point.
    console.error('Unhandled UI error:', error)
  }

  private handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <div className="max-w-md w-full bg-white border rounded-xl p-6 text-center shadow-sm">
            <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto mb-3" />
            <h1 className="text-lg font-bold text-slate-900">Something went wrong</h1>
            <p className="text-sm text-slate-600 mt-2">
              The page encountered an unexpected error. Reload to recover.
            </p>
            <Button className="mt-4" onClick={this.handleReload}>
              <RotateCcw className="w-4 h-4 mr-2" />Reload App
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
