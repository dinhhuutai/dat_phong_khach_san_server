function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000); // Tạo số ngẫu nhiên từ 1000 đến 9999
}

module.exports = generateOTP;
