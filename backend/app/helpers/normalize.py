import unicodedata

def normalize_city_name(name: str) -> str:
    # removes acents
    name = unicodedata.normalize('NFD', name)
    name = ''.join(c for c in name if unicodedata.category(c) != 'Mn')

    # removes trailing spaces and applies format
    return name.strip()
