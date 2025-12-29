def format_alert_email(current_alerts: list[dict], upcoming_alerts: list[dict]) -> str:
    if not current_alerts and not upcoming_alerts:
        return "Nenhum alerta meteorológico ativo no momento."

    lines = []

    for alert in current_alerts:
        lines.append(
            "Alerta Meteorológico Ativo:\n"
            f"""🚨 {alert.get("description")}
            Severidade: {alert.get("severity")}
            Início: {alert.get("start_date")} {alert.get("start_time")}
            Fim: {alert.get("end_date")} {alert.get("end_time")}
            Riscos: {alert.get("risks")}
            Instruções: {alert.get("instructions")}

            """
        )

    for alert in upcoming_alerts:
        lines.append(
            "Alerta Meteorológico Futuro:\n"
            f"""⏳ {alert.get("description")}
            Severidade: {alert.get("severity")}
            Início: {alert.get("start_date")} {alert.get("start_time")}
            Fim: {alert.get("end_date")} {alert.get("end_time")}
            Riscos: {alert.get("risks")}
            Instruções: {alert.get("instructions")}

            """
        )

    return "\n".join(lines)
