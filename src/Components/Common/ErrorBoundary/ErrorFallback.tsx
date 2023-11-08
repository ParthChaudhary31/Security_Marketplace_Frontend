import React from "react";

function ErrorFallback({ error, errorMessage }) {
  return (
    <div className="error_page">
      <div className="error_page_icon">
      </div>
      <h2 className="mt-2">Site is temporary unavailable due to server down</h2>
      <h3>We are trying to have the site online as soon as possible</h3>
    </div>
  );
}

export default ErrorFallback;
