# loaders.py
import httpx, json, pathlib

DATA_URL = "https://servicodados.ibge.gov.br/api/v1/localidades/municipios"
CACHE_FILE = pathlib.Path("municipios.json")

def load_county() -> dict[str, int]:
    if CACHE_FILE.exists():
        return json.loads(CACHE_FILE.read_text())

    resp = httpx.get(DATA_URL, timeout=30)
    resp.raise_for_status()
    data = {m["nome"].lower(): m["id"] for m in resp.json()}
    CACHE_FILE.write_text(json.dumps(data, ensure_ascii=False))
    return data
