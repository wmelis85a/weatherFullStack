import smtplib
from email.message import EmailMessage
from typing import Iterable


class EmailNotifier:
    def __init__(
        self,
        smtp_host: str,
        smtp_port: int,
        username: str,
        password: str,
        sender: str,
        use_ssl: bool = True,
    ):
        self.smtp_host = smtp_host
        self.smtp_port = smtp_port
        self.username = username
        self.password = password
        self.sender = sender
        self.use_ssl = use_ssl

    def send(
        self,
        subject: str,
        body: str,
        recipients: Iterable[str],
    ) -> None:
        if not recipients:
            return

        msg = EmailMessage()
        msg["From"] = self.sender
        msg["To"] = ", ".join(recipients)
        msg["Subject"] = subject
        msg.set_content(body)

        self._send_message(msg)

    def _send_message(self, msg: EmailMessage) -> None:
        if self.use_ssl:
            with smtplib.SMTP_SSL(self.smtp_host, self.smtp_port) as smtp:
                smtp.login(self.username, self.password)
                smtp.send_message(msg)
        else:
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as smtp:
                smtp.starttls()
                smtp.login(self.username, self.password)
                smtp.send_message(msg)
