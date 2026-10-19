export default async function handler(req, res) {
  try {
    const mod = await import('../server/index.js');
    const app = mod.default;
    return app(req, res);
  } catch (err) {
    console.error('Serverless Execution Error:', err);
    return res.status(500).json({
      error: 'Vercel Serverless Function Error',
      message: err.message,
      stack: err.stack,
      name: err.name,
    });
  }
}
