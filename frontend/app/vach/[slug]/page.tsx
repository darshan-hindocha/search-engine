import {getPostBySlug} from "../../../lib/api";
import markdownToHtml from "../../../lib/markdownToHtml";
import markdownStyles from "./markdown-styles.module.css";

export default async function Post({params}: { params: { slug: string } }) {
    const post = getPostBySlug(params.slug, ["section_number", "section_title", "content"]);

    const content = await markdownToHtml(post.content || "");

    return (
        <div className="container mx-auto max-w-md">
            <main>
                <div className="p-4 flex flex-col gap-2 w-full h-16">
                    <p className="text-2xl">{post.section_number}</p>
                    <p className="text-xl text-gray-400">{post.section_title}</p>
                    <div
                        className={markdownStyles["markdown"]}
                        dangerouslySetInnerHTML={{__html: content}}
                    />
                </div>
            </main>
        </div>
    );
}