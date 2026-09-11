import nodemailer from 'nodemailer';

// Helper to extract clean email address from EMAIL_FROM string like '"SoulSync Support" <noreply@soulsync.com>'
const getSenderEmail = (): { name: string; email: string } => {
  const fromStr = process.env.EMAIL_FROM || process.env.VERIFIED_SENDER_EMAIL;
  if (!fromStr) {
    return { name: 'SoulSync Support', email: 'noreply@soulsync.com' };
  }

  const match = fromStr.match(/(?:"?([^"]*)"?\s)?(?:<([^>]+)>|([^\s]+))/);
  if (match) {
    const name = match[1] || 'SoulSync Support';
    const email = match[2] || match[3] || 'noreply@soulsync.com';
    return { name, email };
  }

  return { name: 'SoulSync Support', email: 'noreply@soulsync.com' };
};

export const sendEmail = async (options: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}): Promise<boolean> => {
  const apiKey = process.env.BREVO_API_KEY || process.env.SMTP_PASS;
  const senderInfo = getSenderEmail();

  // 1. Try Brevo HTTPS REST API (Port 443 - Requires Brevo API Key starting with xkeysib-)
  if (apiKey && apiKey.startsWith('xkeysib-')) {
    try {
      console.log(`[Brevo HTTPS API Dispatching] Sending email to ${options.to} from ${senderInfo.email}...`);
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify({
          sender: {
            name: senderInfo.name,
            email: senderInfo.email,
          },
          to: [{ email: options.to }],
          subject: options.subject,
          htmlContent: options.html || `<p>${options.text}</p>`,
          textContent: options.text,
        }),
      });

      if (response.ok) {
        console.log(`[Brevo HTTPS API] Email successfully queued & sent to ${options.to} from ${senderInfo.email}`);
        return true;
      }

      const errText = await response.text();
      console.warn(`[Brevo HTTPS API Warning] ${response.status}: ${errText}. Attempting SMTP fallback...`);
    } catch (apiError: any) {
      console.warn(`[Brevo HTTPS API Error] ${apiError.message}. Attempting SMTP fallback...`);
    }
  }

  // 2. Fallback to Nodemailer SMTP Port 465 (SSL) / 2525
  try {
    const host = process.env.SMTP_HOST || 'smtp-relay.brevo.com';
    const user = process.env.SMTP_USER || senderInfo.email;
    const pass = process.env.SMTP_PASS;

    if (user && pass) {
      const port = parseInt(process.env.SMTP_PORT || '465', 10);
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
        connectionTimeout: 5000,
        socketTimeout: 5000,
        tls: { rejectUnauthorized: false },
      });

      await transporter.sendMail({
        from: `"${senderInfo.name}" <${senderInfo.email}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      console.log(`[Brevo SMTP Service] Email successfully sent to ${options.to}`);
      return true;
    }

    console.log(`[Email Simulation] To: ${options.to} | Subject: ${options.subject}`);
    return true;
  } catch (error: any) {
    console.error(`[Email Error] Failed to send email to ${options.to}: ${error.message}`);
    return false;
  }
};

export const sendOTPEmail = async (email: string, name: string, otpCode: string): Promise<boolean> => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f172a; color: #f8fafc; padding: 30px; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #f43f5e; margin: 0;">❤️ SoulSync</h1>
        <p style="color: #94a3b8; font-size: 14px;">AI Compatibility Partner Matching</p>
      </div>
      <div style="background-color: #1e293b; padding: 20px; border-radius: 12px; text-align: center;">
        <h2 style="color: #ffffff; margin-top: 0;">Account Verification Code</h2>
        <p style="color: #cbd5e1;">Hello <strong>${name}</strong>, use the 6-digit OTP code below to verify your email address:</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #38bdf8; background-color: #0f172a; padding: 15px; border-radius: 8px; display: inline-block; margin: 15px 0;">
          ${otpCode}
        </div>
        <p style="color: #64748b; font-size: 12px;">Valid for 15 minutes. Do not share this OTP with anyone.</p>
      </div>
    </div>
  `;

  console.log(`🔑 [OTP Dispatch] Generated OTP ${otpCode} for ${email}`);

  return await sendEmail({
    to: email,
    subject: `❤️ ${otpCode} is your SoulSync Verification OTP Code`,
    text: `Hello ${name}, your 6-digit verification OTP code is: ${otpCode}`,
    html: htmlContent,
  });
};

export const sendPasswordResetEmail = async (email: string, name: string, resetToken: string): Promise<boolean> => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f172a; color: #f8fafc; padding: 30px; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #f43f5e; margin: 0;">❤️ SoulSync</h1>
        <p style="color: #94a3b8; font-size: 14px;">AI Compatibility Partner Matching</p>
      </div>
      <div style="background-color: #1e293b; padding: 20px; border-radius: 12px; text-align: center;">
        <h2 style="color: #ffffff; margin-top: 0;">Password Reset Request</h2>
        <p style="color: #cbd5e1;">Hello <strong>${name}</strong>, we received a request to reset your password. Use the 6-digit code below to complete the reset:</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #f43f5e; background-color: #0f172a; padding: 15px; border-radius: 8px; display: inline-block; margin: 15px 0;">
          ${resetToken}
        </div>
        <p style="color: #94a3b8; font-size: 12px;">This code will expire in 15 minutes. If you did not request this, please ignore this email or secure your account.</p>
      </div>
    </div>
  `;

  return await sendEmail({
    to: email,
    subject: `🔒 ${resetToken} is your SoulSync Password Reset Code`,
    text: `Hello ${name}, your 6-digit password reset code is: ${resetToken}. Valid for 15 minutes.`,
    html: htmlContent,
  });
};

