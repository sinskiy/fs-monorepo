import axios from "axios";

export const getErrorAndLog = (e: unknown) => {
  if (axios.isAxiosError(e)) {
    if (e?.response?.data && typeof e?.response?.data === "string") {
      const message = e.response.data.replace(
        "Something went wrong. Error: ",
        ""
      );
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
