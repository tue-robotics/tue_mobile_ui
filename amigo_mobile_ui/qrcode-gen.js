var QRCode = require('qrcode');

var filename = 'qr.png';
var text = 'http://192.168.2.91:8000/';

QRCode.save(filename, text, function (error, written) {
	if (error) {
		console.log('error:', error);
	} else {
		console.log('saved qr code of "'+text+'"" as '+filename+', bytes written:', written);
	}
});
