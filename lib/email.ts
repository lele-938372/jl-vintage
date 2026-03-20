// Email sending via Resend
export async function sendVerificationEmail(to: string, name: string, code: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || 'noreply@jlvintage.com';

  if (!apiKey || apiKey === 're_xxxxxxxxxxxx') {
    console.log(`[DEV] Verification code for ${to}: ${code}`);
    return { success: true, dev: true };
  }

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to,
      subject: 'JL VINTAGE - Dein Bestaetigungscode',
      html: `
        <div style="font-family:'Georgia',serif;max-width:520px;margin:0 auto;background:#F7F3EC;padding:40px;">
          <h1 style="font-family:'Georgia',serif;color:#1C1812;font-size:28px;margin-bottom:8px;letter-spacing:2px;">JL VINTAGE</h1>
          <hr style="border:1px solid #8B6914;margin-bottom:32px;">
          <p style="color:#1C1812;font-size:16px;">Hallo ${name},</p>
          <p style="color:#6B6560;font-size:15px;line-height:1.6;">Bitte gib den folgenden Code ein, um dein Konto zu bestaetigen:</p>
          <div style="background:#1C1812;color:#F7F3EC;font-size:36px;letter-spacing:12px;text-align:center;padding:24px;margin:24px 0;font-family:'Georgia',serif;">${code}</div>
          <p style="color:#6B6560;font-size:13px;">Dieser Code ist 15 Minuten gueltig.</p>
          <hr style="border:1px solid #E8DFC8;margin-top:32px;">
          <p style="color:#8B6914;font-size:12px;letter-spacing:1px;">JL VINTAGE &mdash; LEANDRO & JUSTIN</p>
        </div>
      `,
    });
    return { success: true };
  } catch (e) {
    console.error('Email error:', e);
    return { success: false };
  }
}
