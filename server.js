const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

// Trỏ đến thư mục chứa React build
const buildDir = path.join(__dirname, 'build');
app.use(express.static(buildDir));

// Phục vụ index.html cho tất cả các request không khớp
app.get('*', (req, res) => {
    res.sendFile(path.join(buildDir, 'index.html'));
});

app.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`);
});
