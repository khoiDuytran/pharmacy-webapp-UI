import { useLocation } from "react-router-dom";

const AUTH_ROUTES = ["/login", "/register", "/cart"];

function useAuthLocation() {
  const location = useLocation();

  const isAuthPage = AUTH_ROUTES.includes(location.pathname);

  return {
    isAuthPage,
    pathname: location.pathname,
  };
}

export default useAuthLocation;
