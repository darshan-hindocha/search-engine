import re
import json


def main():
    # Read the markdown file
    with open("data/gadhada_pratham.md", "r") as f:
        md = f.read()

    # Split the markdown file into sections
    sections = re.split(r"\n---\n", md)

    data = []
    for section in sections:
        parts = section.replace('\n', '').split('<p')
        title = parts[0].replace('#', '').strip()
        section_number = title.split('->')[0]
        section_title = title.split('->')[1].strip()

        paragraphs = []
        for part in parts[1:]:
            paragraph = part.split('>')[1].split('</p')[0].strip()
            paragraphs.append(paragraph)

        data.append({
            "section_number": section_number,
            "section_title": section_title,
            "paragraphs": paragraphs,
            "slug": f"vach/pratham-{section_number.split('-')[-1].replace(' ', '')}"
        })
    print(data)

    # Write the data to a JSON file
    with open("data/gadhada_pratham.json", "w") as f:
        json.dump(data, f, indent=4)


if __name__ == "__main__":
    main()
