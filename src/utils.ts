export const showAlert = (message: string) => {
  console.warn("Alert:", message);
  alert("Aviso: " + message);
};

export const showError = (error: string | Error) => {
  console.error("Error:", error);
  alert("Error: " + error);
};
