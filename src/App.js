import { Route, Routes, BrowserRouter as Router } from "react-router-dom";

import { publicRoutes } from "./routes";
import DefaultLayout from "./layouts/DefautLayout";
import ScrollToTop from "./components/ScrollToTop";
import { ToastProvider } from "./contexts/ToastProvider";

function App() {
  const renderRoutes = (routes) => {
    return routes.map((route, index) => {
      const Page = route.component;
      if (route.children) {
        return (
          <Route
            key={index}
            path={route.path}
            element={
              <DefaultLayout>
                <Page />
              </DefaultLayout>
            }
          >
            {route.children.map((child, childIndex) => {
              const ChildPage = child.component;
              return (
                <Route
                  key={childIndex}
                  path={child.path}
                  element={<ChildPage />}
                />
              );
            })}
          </Route>
        );
      }
      return (
        <Route
          key={index}
          path={route.path}
          element={
            <DefaultLayout>
              <Page />
            </DefaultLayout>
          }
        />
      );
    });
  };

  return (
    <ToastProvider>
      <Router>
        <div className="App">
          <ScrollToTop />
          <Routes>{renderRoutes(publicRoutes)}</Routes>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
