import { Component, type ErrorInfo, type ReactNode } from "react";
import Button from "./ui/Button";
import BrandLogo from "./BrandLogo";
import { reportError } from "../lib/monitoring";

interface Props { children: ReactNode }
interface State { failed: boolean }

export default class AppErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    reportError(error,{componentStack:info.componentStack?.slice(0,2000)});
    // Keep the boundary provider-neutral. A production monitoring adapter can
    // listen for this event without receiving form values or account data.
    window.dispatchEvent(new CustomEvent("mc:application-error", {
      detail: { message: error.message, componentStack: info.componentStack },
    }));
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <section role="alert" className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex justify-center"><BrandLogo /></div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Something went wrong</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Your account data has not been changed. Reload the page and try again. If the problem continues, contact MlimiConnect support.</p>
          <Button className="mt-6" onClick={() => window.location.reload()}>Reload application</Button>
        </section>
      </main>
    );
  }
}
