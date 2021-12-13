import React from "react";
import "./App.css";
import { useAuth } from "context/auth-context";
// import { AuthenticatedApp } from "authenticated-app";
// import { UnauthenticatedApp } from "unauthenticated-app";
import { ErrorBoundary } from "components/error-boundary";
import { FullPageFallback, FullPageLoadig } from "components/lib";

const AuthenticatedApp = React.lazy(() => import("authenticated-app"));
const UnauthenticatedApp = React.lazy(() => import("unauthenticated-app"));

function App() {
  const { user } = useAuth();
  return (
    <div className="App">
      <ErrorBoundary fallbackRender={FullPageFallback}>
        <React.Suspense fallback={<FullPageLoadig />}>
          {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
        </React.Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default App;
