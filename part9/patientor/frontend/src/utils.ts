import axios from "axios";

export const getErrorAndLog = (e: unknown) => {
  if (axios.isAxiosError(e)) {
    console.log(e.response?.data);
    if (e?.response?.data && typeof e?.response?.data === "string") {
      const message = e.response.data.replace(
        "Something went wrong. Error: ",
        ""
      );
      console.error(message);
      return message;
    } else if (e.response?.data && typeof e.response.data?.error === "object") {
      let message = "";
      for (const key in e.response.data.error) {
        message += `${key}: ${e.response.data.error[key].join(", ")}\n`;
      }
      console.error(message);
      return message;
    } else {
      return "Unrecognized axios error";
    }
  } else {
    console.error("Unknown error", e);
    return "Unknown error";
  }
};
