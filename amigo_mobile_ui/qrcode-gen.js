const QRCode = require('qrcode');

const filename = 'qr.png';
const text = 'http://192.168.2.91:8000/';

QRCode.save(filename, text, (error, written) => {
  if (error) {
    console.log('error:', error);
  } else {
    console.log(`saved qr code of "${text}"" as ${filename}, bytes written:`, written);
  }
});
