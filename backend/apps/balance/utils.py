import re


def is_valid_uuid4(value: str) -> bool:
    uuid4_pattern = re.compile(
        r"^[\da-fA-F]{8}-[\da-fA-F]{4}-[1-5][\da-fA-F]{3}-[89abAB][\da-fA-F]{3}-[\da-fA-F]{12}$"
    )

    return bool(uuid4_pattern.match(value))
