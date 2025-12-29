from pydoc import text
from dotenv import load_dotenv
import httpx , unicodedata
from app.config import INMET_ALERTS_API
from app.services.templates import format_alert_email

load_dotenv()

class AlertService:
    def __init__(self, alerts):
        self.alerts = alerts

    async def run(self):
        raw_data = await self.client.fetch_alerts(self.alerts)
        await self.email_notifier()
        alerts = self.parser.parse(raw_data)
        relevant = self._filter(alerts)
        self.notifier.send(relevant)

    def normalize(text: str) -> str:
        if not text:
            return ""
        
        return (
            unicodedata.normalize("NFKD", text)
            .encode("ASCII", "ignore")
            .decode("utf-8")
            .lower()
        )

    def is_relevant(alert: dict, region: str) -> bool:
        normalize = AlertService.normalize
        regions = alert.get("mesorregioes", "")
        
        return normalize(region) in normalize(regions)
    
    def map_alert(alert: dict) -> dict:
        return {
            "id": alert.get("id_aviso"),
            "severity_id": alert.get("id_condicao_severa"),
            "start_date": alert.get("data_inicio"),
            "start_time": alert.get("hora_inicio"),
            "end_date": alert.get("data_fim"),
            "end_time": alert.get("hora_fim"),
            "closed": alert.get("encerrado"),
            "description": alert.get("descricao"),
            "severity": alert.get("severidade"),
            "risks": alert.get("riscos"),
            "instructions": alert.get("instrucoes"),
        }
    
    def process_alerts(alerts: list, region: str) -> list:
        result = []
        is_relevant = AlertService.is_relevant
        map_alert = AlertService.map_alert

        for alert in alerts:
            if is_relevant(alert, region):
                result.append(map_alert(alert))

        return result




    async def fetch_alerts(self):
        process_alerts = AlertService.process_alerts
        headers = {
            "User-Agent": "Mozilla/5.0 (compatible; WeatherAlertService/1.0)",
            "Accept": "application/json",
        }
        try:
            async with httpx.AsyncClient(headers=headers, timeout=httpx.Timeout(15.0)) as client:
                response = await client.get(f"{INMET_ALERTS_API}/{self.alerts}")
                response.raise_for_status()

                # Ensure the response is JSON and parse safely
                content_type = response.headers.get("Content-Type", "")
                if "application/json" not in content_type:
                    snippet = (response.text or "").strip()[:200]
                    raise RuntimeError(f"Alerts API returned non-JSON content-type: {content_type}. Snippet: {snippet}")

                try:
                    data = response.json()
                except ValueError as exc:
                    snippet = (response.text or "").strip()[:200]
                    raise RuntimeError(f"Invalid JSON from Alerts API. Snippet: {snippet}") from exc

            current_alerts = data.get("hoje", [])
            future_alerts_raw = data.get("futuro", [])

            # 1) Colects ids from current alerts
            current_ids = {
                alert.get("id")
                for alert in current_alerts
                if alert.get("id") is not None
            }

            # 2) Remove future alerts that are already active
            future_alerts = [
                alert
                for alert in future_alerts_raw
                if alert.get("id") not in current_ids
            ]

            region = "Metropolitana do Rio de Janeiro"

            return {
                "Current alerts": process_alerts(current_alerts, region),
                "Upcoming alerts": process_alerts(future_alerts, region),
            }

        except httpx.ReadTimeout as exc:
            raise RuntimeError("Alerts API timed out") from exc
        except httpx.RequestError as exc:
            raise RuntimeError(f"Alerts API request failed: {exc}") from exc

            
        
    async def email_notifier(self):
        from app.services.EmailNotifier import EmailNotifier
        from app.config import SMTP_SERVER, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD, SENDER_EMAIL

        send_email = EmailNotifier(
            smtp_host=SMTP_SERVER,
            smtp_port=int(SMTP_PORT),
            username=SMTP_USERNAME,
            password=SMTP_PASSWORD,
            sender=SENDER_EMAIL,
            use_ssl=True,
        ).send

        alerts = await self.fetch_alerts()
        

        if alerts["Current alerts"]:
            body = format_alert_email(alerts["Current alerts"],alerts["Upcoming alerts"])

            send_email(
                subject="🚨 Alerta meteorológico ativo",
                body=body,
                recipients=["wesley.m3lis@email.com,fdesouza85@outlook.com"],
            )


        return {"status": "email processed"}

    
        
                    
            
          