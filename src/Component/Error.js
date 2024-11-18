import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectUrl = new URLSearchParams(location.search).get("redirectUrl");
  const errorType = new URLSearchParams(location.search).get("type");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (redirectUrl) {
        navigate(redirectUrl);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, redirectUrl]);

  return (
    <div>
      <h1>오류가 발생했습니다</h1>
      {errorType === "api" && <p>API 요청 중 오류가 발생했습니다.</p>}
      {errorType === "notfound" && <p>잘못된 경로로 접근하였습니다.</p>}
      <p>5초 후 원래 페이지로 이동합니다...</p>
    </div>
  );
};

export default ErrorPage;