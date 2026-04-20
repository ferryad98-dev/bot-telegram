export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  const { ewallet_code, phone_number } = req.body;

  if (!ewallet_code || !phone_number) {
    return res.status(400).json({ status: 'error', message: 'Data tidak lengkap' });
  }

  try {
    const response = await fetch('https://rfpdev.xyz/api/check-ewallet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        api_key: process.env.API_KEY,
        ewallet_code,
        phone_number
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Terjadi kesalahan saat menghubungi server' 
    });
  }
}
