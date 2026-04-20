export default async function handler(req, res) {
  // Tambahkan CORS header supaya aman
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  const { bank_code, account_number } = req.body;

  if (!bank_code || !account_number) {
    return res.status(400).json({ status: 'error', message: 'Data tidak lengkap' });
  }

  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error("API_KEY environment variable tidak ditemukan!");
    return res.status(500).json({ 
      status: 'error', 
      message: 'Konfigurasi server bermasalah (API key tidak ada)' 
    });
  }

  try {
    const response = await fetch('https://rfpdev.xyz/api/check-rekening', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        api_key: apiKey,
        bank_code: bank_code,
        account_number: account_number
      }),
      // Tambahkan timeout supaya tidak hang
      signal: AbortSignal.timeout(15000) // 15 detik
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error("Error fetch ke rfpdev:", error.message);
    return res.status(500).json({ 
      status: 'error', 
      message: 'Gagal menghubungi server penyedia data. Coba lagi sebentar lagi.' 
    });
  }
}
