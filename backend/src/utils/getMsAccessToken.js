export const getMsAccessToken = (req) => {
  const fromCustomHeader = req.headers["x-ms-access-token"]; // preferred
  const fromLegacyHeader = req.headers["ms_token"]; // matches planner sample

  const token = Array.isArray(fromCustomHeader)
    ? fromCustomHeader[0]
    : fromCustomHeader || (Array.isArray(fromLegacyHeader) ? fromLegacyHeader[0] : fromLegacyHeader);

  return typeof token === "string" && token.trim() ? token.trim() : null;
};
