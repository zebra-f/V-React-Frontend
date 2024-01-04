import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useRedirectAuthenticatedUserEffect = (
  isAuthenticated: boolean,
  redirectPath: string
) => {
  const navigate = useNavigate();
  const handleAuthenticatedUser = () => {
    if (isAuthenticated) {
      navigate(redirectPath);
    }
  };
  useEffect(() => {
    handleAuthenticatedUser();
  }, [isAuthenticated]);
};

export const useRedirectAnonUserEffect = (
  isAuthenticated: boolean,
  redirectPath: string
) => {
  const navigate = useNavigate();
  const handleAnonUser = () => {
    if (!isAuthenticated) {
      navigate(redirectPath);
    }
  };
  useEffect(() => {
    handleAnonUser();
  }, [isAuthenticated]);
};
