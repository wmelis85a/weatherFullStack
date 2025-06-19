translation_map = {
    "pn": "parcialmente nublado",
    "ec": "Encoberto com Chuvas Isoladas",
    "ci": "Chuvas Isoladas",
    "c"	: "Chuva",
    "in": "Instável",
    "pp": "Poss. de Pancadas de Chuva",
    "cm": "Chuva pela Manhã",
    "cn": "Chuva a Noite",
    "pt": "Pancadas de Chuva a Tarde",
    "pm": "Pancadas de Chuva pela Manhã",
    "np": "Nublado e Pancadas de Chuva",
    "pc": "Pancadas de Chuva",
    "pn": "Parcialmente Nublado",
    "cv": "Chuvisco",
    "ch": "Chuvoso",
    "t":  "Tempestade",
    "ps": "Predomínio de Sol",
    "e":  "Encoberto",
    "n":  "Nublado",
    "cl": "Céu Claro",
    "nv": "Nevoeiro",
    "g": "Geada",
    "ne": "Neve",
    "nd": "Não Definido",
    "pnt": "Pancadas de Chuva a Noite",
    "psc": "Possibilidade de Chuva",
    "pcm": "Possibilidade de Chuva pela Manhã",
    "pct": "Possibilidade de Chuva a Tarde",
    "pcn": "Possibilidade de Chuva a Noite",
    "npt": "Nublado com Pancadas a Tarde",
    "npn": "Nublado com Pancadas a Noite",
    "ncn": "Nublado com Poss. de Chuva a Noite",
    "nct": "Nublado com Poss. de Chuva a Tarde",
    "ncm": "Nubl. c/ Poss. de Chuva pela Manhã",
    "npm": "Nublado com Pancadas pela Manhã",
    "npp": "Nublado com Possibilidade de Chuva",
    "vn": "Variação de Nebulosidade",
    "ct": "Chuva a Tarde",
    "ppn": "Poss. de Panc. de Chuva a Noite",
    "ppt": "Poss. de Panc. de Chuva a Tarde",
    "ppm": "Poss. de Panc. de Chuva pela Manhã"
}

def translate_dict_values(data, translation_map, keys_to_translate=None):
    """
    Recursively translates values of specified keys in a nested dictionary or list structure 
    using a given translation map.

    This function traverses the input data structure and replaces the values of specified keys 
    (if found in the translation map) with their corresponding translated values. It handles 
    dictionaries nested within dictionaries and lists.

    Args:
        data (dict | list): The input data structure, which may contain nested dictionaries or lists.
        translation_map (dict): A mapping of original values (keys) to their translated values.
        keys_to_translate (list[str], optional): A list of keys to look for in the structure. 
            If None, all keys will be considered for translation.

    Returns:
        dict | list: The modified data structure with translated values.

    Example:
        data = {
            "cidade": {
                "previsao": [
                    {"tempo": "pn", "maxima": "30"},
                    {"tempo": "ec", "maxima": "25"}
                ]
            }
        }

        translation_map = {
            "pn": "Parcialmente Nublado",
            "ec": "Encoberto com Chuvas Isoladas"
        }

        translate_dict_values(data, translation_map, keys_to_translate=["tempo"])
        # Result:
        # {
        #     "cidade": {
        #         "previsao": [
        #             {"tempo": "Parcialmente Nublado", "maxima": "30"},
        #             {"tempo": "Encoberto com Chuvas Isoladas", "maxima": "25"}
        #         ]
        #     }
        # }
    """
    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, (dict, list)):
                translate_dict_values(value, translation_map, keys_to_translate)
            else:
                if keys_to_translate is None or key in keys_to_translate:
                    if value in translation_map:
                        data[key] = translation_map[value]
    elif isinstance(data, list):
        for item in data:
            translate_dict_values(item, translation_map, keys_to_translate)
    return data
