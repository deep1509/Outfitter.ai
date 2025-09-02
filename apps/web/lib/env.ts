export const env = {
  allowedShops:
    process.env.ALLOWED_SHOPS?.split(',').map((s) => s.trim()) || [],
};
