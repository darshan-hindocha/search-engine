import fs from "fs";
import {join} from "path";
import matter from "gray-matter";

const postsDirectory = join(process.cwd(), "data", "vach");

export function getPostSlugs() {
    return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string, fields: string[] = []) {
    const realSlug = slug.replace(/\.md$/, "");
    const fullPath = join(postsDirectory, `${realSlug}.md`);
    const fileContents = fs.readFileSync(fullPath);
    const {data, content} = matter(fileContents);

    type Items = {
        [key: string]: string;
    };

    const items: Items = {};

    // Ensure only the minimal needed data is exposed
    fields.forEach((field) => {
        if (field === "slug") {
            items[field] = realSlug;
        }
        if (field === "content") {
            items[field] = content;
        }

        if (typeof data[field] !== "undefined") {
            items[field] = data[field];
        }
    });

    return items;
}

export function getAllPosts(fields: string[] = []) {
    const slugs = getPostSlugs();

    return slugs
        .map((slug) => getPostBySlug(slug, fields))
        // sort posts by date in descending order
        .sort((post1, post2) => (
                // @ts-ignore
                parseInt(post1.section_number?.split('-').at(-1))
                <
                // @ts-ignore
                parseInt(post2.section_number?.split('-').slice(-1))
                    ? -1 : 1
            )
        )
        ;
}