import re
import math


def calculate_reading_time(html_content: str, words_per_minute: int = 200) -> int:
    if not html_content:
        return 1

    clean_text = re.sub(r"<[^>]+>", " ", html_content)

    words = clean_text.split()
    word_count = len(words)

    minutes = math.ceil(word_count / words_per_minute)

    return max(1, minutes)
