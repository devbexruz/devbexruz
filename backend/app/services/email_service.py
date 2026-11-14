import smtplib
import asyncio
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from app.core.config import settings

logger = logging.getLogger("email_service")

def _send_email_sync(to_email: str, subject: str, html_content: str, text_content: str) -> bool:
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        logger.warning(
            f"[MOCK EMAIL / NO SMTP CREDENTIALS] Email to: {to_email} | Subject: {subject}\n"
            f"Content: {text_content}"
        )
        return False

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{settings.EMAILS_FROM_NAME} <{settings.EMAILS_FROM_EMAIL or settings.SMTP_USER}>"
        msg["To"] = to_email

        part1 = MIMEText(text_content, "plain", "utf-8")
        part2 = MIMEText(html_content, "html", "utf-8")

        msg.attach(part1)
        msg.attach(part2)

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.EMAILS_FROM_EMAIL or settings.SMTP_USER, [to_email], msg.as_string())

        logger.info(f"Verification email sent successfully to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {e}")
        return False

async def send_verification_email(to_email: str, code: str) -> bool:
    subject = f"{code} — Developer Logic tasdiqlash kodi"
    
    text_content = f"""Assalomu alaykum!

Developer Logic (developerlogic.uz) platformasida ro'yxatdan o'tish uchun sizning tasdiqlash kodingiz:

{code}

Ushbu kod 10 daqiqa davomida amal qiladi.
Agar siz ro'yxatdan o'tishni so'ramagan bo'lsangiz, ushbu xatni e'tiborsiz qoldiring.

Hurmat bilan,
Developer Logic Jamoasi
"""

    html_content = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }}
    .container {{ max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }}
    .header {{ background: #0f172a; padding: 24px; text-align: center; }}
    .header h1 {{ color: #ffffff; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }}
    .header span {{ color: #d97706; font-size: 13px; font-weight: 600; display: block; margin-top: 4px; }}
    .content {{ padding: 32px 24px; text-align: center; }}
    .intro {{ font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 24px; }}
    .code-box {{ display: inline-block; background: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 10px; padding: 18px 36px; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #1e3a8a; margin: 16px 0; }}
    .warning {{ font-size: 13px; color: #b45309; background: #fef3c7; border: 1px solid #fde68a; border-radius: 6px; padding: 10px 14px; margin-top: 24px; line-height: 1.5; }}
    .footer {{ background: #f8fafc; border-top: 1px solid #f1f5f9; padding: 16px 24px; text-align: center; font-size: 12px; color: #94a3b8; }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>DEVELOPER LOGIC</h1>
      <span>SYSTEM ARCHITECTURE &amp; AI PLATFORM</span>
    </div>
    <div class="content">
      <p class="intro">Assalomu alaykum! Platformada yangi hisob yaratish uchun quyidagi 6 xonali tasdiqlash kodidan foydalaning:</p>
      <div class="code-box">{code}</div>
      <div class="warning">
        ⏳ Ushbu kod <strong>10 daqiqa</strong> davomida amal qiladi. Xavfsizligingiz uchun uni hech kimga bermang.
      </div>
    </div>
    <div class="footer">
      Developer Logic &copy; 2026. Avtomatlashtirilgan no-reply xabarnoma.
    </div>
  </div>
</body>
</html>"""

    # Run blocking SMTP in thread pool to prevent blocking asyncio loop
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(None, _send_email_sync, to_email, subject, html_content, text_content)
