const FIGMA_TOKEN = 'figd_0CYtmCTQigDonCeIEL5vEBhBwEp0lrXQ1Ah8_Ptj';
const FILE_KEY = 'rJ5plZLstiM2FqswsVPfOX';

async function getFigmaFile() {
  try {
    const response = await fetch(`https://api.figma.com/v1/files/${FILE_KEY}`, {
      headers: {
        'X-Figma-Token': FIGMA_TOKEN
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

getFigmaFile();

