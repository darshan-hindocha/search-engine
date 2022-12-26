from typing import List
from dataclasses import dataclass


@dataclass
class SearchResponse:
    content: str
    section_title: str
    chapter_title: str
    book_title: str
    book_id: str


def search(query: str) -> List[SearchResponse]:


    return [SearchResponse(
        content="",
        section_title="",
        chapter_title="",
        book_title="",
        book_id=""
    )]
