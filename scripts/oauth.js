function getAuthToken() {
  try {
    return new Promise((resolve, reject) => {
      chrome.identity.getAuthToken({ interactive: true }, function (token) {
        if (chrome.runtime.lastError || !token) {
          console.log("Token failed" + chrome.runtime.lastError);
          reject(chrome.runtime.lastError);
        } else {
          console.log("Token fetched.");
          resolve(token);
        }
      });
    });
  } catch (err) {
    console.error("Error getting auth token: ", err);
    return null;
  }
}
