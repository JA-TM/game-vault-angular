module.exports = async function handler(req, res) {
  const key = process.env.RAWG_API_KEY;
  if (!key) {
    return res.status(500).json({ error: 'RAWG_API_KEY not configured' });
  }

  const pathParam = req.query.path;
  const path = Array.isArray(pathParam) ? pathParam.join('/') : (pathParam || 'games');
  const query = { ...req.query };
  delete query.path;
  const params = new URLSearchParams({ ...query, key: key });
  const url = `https://api.rawg.io/api/${path}?${params}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch {
    res.status(502).json({ error: 'RAWG proxy error' });
  }
};
