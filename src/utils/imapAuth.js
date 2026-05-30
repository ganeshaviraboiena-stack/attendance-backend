const { ImapFlow } = require("imapflow");

const authenticateWithIMAP = async (
  email,
  password
) => {
  try {
    const client = new ImapFlow({
      host:
        process.env.MAIL_HOST,
      port: Number(
        process.env.IMAP_PORT
      ),
      secure: true,
      auth: {
        user: email,
        pass: password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await client.connect();

    await client.mailboxOpen(
      "INBOX"
    );

    await client.logout();

    return {
      success: true,
    };
  } catch (error) {
    console.log(
      "IMAP ERROR:",
      error.message
    );

    return {
      success: false,
    };
  }
};

module.exports =
  authenticateWithIMAP;