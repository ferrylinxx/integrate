const https = require('https');

const FIGMA_TOKEN = 'figd_0CYtmCTQigDonCeIEL5vEBhBwEp0lrXQ1Ah8_Ptj';
const FILE_KEY = 'rJ5plZLstiM2FqswsVPfOX';

// Image references from the Figma file
const imageRefs = [
  '7f468f7b8341e70652c4cd138b279ce46a17d369', // Background image (Fons)
  '30056766a22db22247e72463826e9e09c5fffac5', // Image 1
  'bafb5d4025577f2ac2fbeef66edda86172c34926', // Image 2
  '1ecb5c4b2d424a1c36b971d51abeca5d5b33854a', // Image 3
];

function getImageUrls() {
  const options = {
    hostname: 'api.figma.com',
    path: `/v1/files/${FILE_KEY}/images`,
    method: 'GET',
    headers: {
      'X-Figma-Token': FIGMA_TOKEN
    }
  };

  const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        console.log(JSON.stringify(parsed, null, 2));
      } catch (error) {
        console.error('Error parsing JSON:', error.message);
        console.log('Raw data:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Error:', error.message);
  });

  req.end();
}

getImageUrls();

