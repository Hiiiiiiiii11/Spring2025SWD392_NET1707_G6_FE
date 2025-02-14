require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 4000;

// 🛠 Trỏ đến thư mục build của React
const buildPath = path.join(__dirname, 'build');
app.use(express.static(buildPath));

// 🛠 Trả về index.html cho mọi route không phải API
app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

// 🛠 Khởi động server và tự động mở trình duyệt
app.listen(port, () => {
    console.log(`✅ React server is running on http://localhost:${port}`);
    // 🛠 Mở trình duyệt tự động (chỉ trên Windows, Mac, Linux cần chỉnh sửa)
    const open = require('open');
    open(`http://localhost:${port}`);
});
