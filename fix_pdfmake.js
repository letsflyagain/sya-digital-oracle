const fs = require('fs');
const vfs = require('pdfmake/build/vfs_fonts');
const fontContent = fs.readFileSync('node_modules/pdfmake/build/vfs_fonts.js', 'utf8');
// The issue is likely that vfs_fonts.js does not export correctly for the environment.
// pdfmake/build/vfs_fonts actually contains the base64 of Roboto.
