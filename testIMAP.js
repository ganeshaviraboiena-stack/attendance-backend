require('dotenv').config();
const { ImapFlow } = require('imapflow');

async function testIMAPConnection() {
    console.log('🔧 Testing IMAP Connection to cPanel...\n');
    
    // Your cPanel email credentials
    const email = 'ganesh.dev@vblp.co.in';
    const password = '%5^dwa&l1zp{wuY?'; // Replace with actual password
    
    // Connection configurations to try
    const configs = [
        {
            name: "Standard IMAP SSL (Port 993)",
            host: process.env.MAIL_HOST || 'mail.vblp.co.in',
            port: 993,
            secure: true,
            auth: { user: email, pass: password }
        },
        {
            name: "IMAP with STARTTLS (Port 143)",
            host: process.env.MAIL_HOST || 'mail.vblp.co.in',
            port: 143,
            secure: false,
            auth: { user: email, pass: password }
        },
        {
            name: "Alternative: mail.vblp.co.in with full email",
            host: 'mail.vblp.co.in',
            port: 993,
            secure: true,
            auth: { user: email, pass: password }
        },
        {
            name: "Without domain prefix (just username)",
            host: process.env.MAIL_HOST || 'mail.vblp.co.in',
            port: 993,
            secure: true,
            auth: { user: email.split('@')[0], pass: password }
        }
    ];
    
    for (const config of configs) {
        console.log(`\n📡 Testing: ${config.name}`);
        console.log(`   Host: ${config.host}:${config.port}`);
        console.log(`   Username: ${config.auth.user}`);
        console.log(`   Secure: ${config.secure}`);
        
        const client = new ImapFlow({
            host: config.host,
            port: config.port,
            secure: config.secure,
            auth: config.auth,
            logger: true, // Enable logging for debugging
            tls: {
                rejectUnauthorized: false // Allow self-signed certificates
            },
            timeout: 30000
        });
        
        try {
            await client.connect();
            console.log(`   ✅ SUCCESS! Connected to ${config.name}`);
            
            // Try to get mailbox info
            const mailbox = await client.mailboxOpen('INBOX');
            console.log(`   📧 Mailbox: ${mailbox.path}, Messages: ${mailbox.exists}`);
            
            await client.logout();
            console.log(`   ✅ Connection working! Use this configuration.\n`);
            return true;
        } catch (error) {
            console.log(`   ❌ Failed: ${error.message}`);
            if (error.stack) {
                console.log(`   Details: ${error.stack.split('\n')[0]}`);
            }
        }
    }
    
    console.log('\n❌ All connection attempts failed. Please check:');
    console.log('1. Your email password is correct');
    console.log('2. IMAP is enabled in cPanel');
    console.log('3. The mail server hostname is correct');
    console.log('4. Your IP is not blocked by firewall');
    
    return false;
}

// Run the test
testIMAPConnection().catch(console.error);