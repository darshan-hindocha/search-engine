from md_to_json import get_structured_data
import os


def main():
    # Read the markdown file
    with open("data/gadhada_pratham.md", "r") as f:
        md = f.read()

    # Get the structured data
    data = get_structured_data(md)
    for d in data:
        output = ""
        output += "---\n"
        output += f"section_number: {d['section_number']}\n"
        output += f"section_title: {d['section_title']}\n"
        output += f"slug: {d['slug']}\n"
        output += "---\n"
        for p in d['paragraphs']:
            output += f"{p}\n\n"
        filepath = f"../../frontend/data/{d['slug']}.mdx"
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, "w") as f:
            f.write(output)

    return


if __name__ == "__main__":
    main()
