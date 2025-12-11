import xml.etree.ElementTree as ET

def parse_cptec_xml_to_dict(xml_string: str) -> dict:
    """Converts CPTEC XML response to a dictionary."""
    root = ET.fromstring(xml_string)
    
    def get_text(elem, tag):
        child = elem.find(tag)
        return child.text if child is not None else None
    
    cidade_dict = {
        "nome": get_text(root, "nome"),
        "uf": get_text(root, "uf"),
        "atualizacao": get_text(root, "atualizacao"),
        "previsao": [
            {
                "dia": get_text(p, "dia"),
                "tempo": get_text(p, "tempo"),
                "maxima": get_text(p, "maxima"),
                "minima": get_text(p, "minima"),
                "iuv": get_text(p, "iuv"),
            }
            for p in root.findall("previsao")
        ]
    }
    
    return cidade_dict