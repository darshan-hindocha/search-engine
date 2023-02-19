import {getAllPosts} from "../../lib/api";
import Link from "next/link";

export default function Blog() {
    const posts = getAllPosts(["slug", "section_title", "section_number"]);

    return (
        <div className="container mx-auto px-5">
            <main>
                <div className="grid grid-cols-2 py-2 gap-4">
                    {posts.slice(1, -1).map((post) => (
                        <div
                            key={post.slug}
                            className="flex flex-col border-2 border-black p-4 rounded-xl bg-amber-50"
                        >
                            <Link href={`${post.slug}`}
                            >
                                <h4>{post.section_number}</h4>
                                <p className="text-bespoke-deep-reddish-brown">{post.section_title}</p>
                            </Link>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}