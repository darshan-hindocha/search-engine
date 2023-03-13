import {getAllPosts} from "../../lib/api";
import Link from "next/link";
import Image from "next/image";

function ContentPreviewInformation() {
    const image = '/static/images/vach_tile.png'
    const title = 'The Vachanamrut'
    const author = 'Sahajanand Swami'
    const type = 'Book'
    const content = `The Vachanamrut is the major scripture of the Swaminarayan Sampraday. Through sermons and
                    question-answer sessions, Bhagwan Swaminarayan provides practical and enlightening guidance on all
                    aspects of spirituality for all spiritual aspirants.
                    <br/>
                    The Vachanamrut is a principal scripture of the Swaminarayan Sampraday. It is a compilation of 273
                    spiritual discourses delivered by Bhagwan Swaminarayan from 1819 CE to 1829 CE. It is a catechism
                    filled with infallible logic, illuminating analogies and etaphors, and divine revelations that
                    provide philosophical and practical answers to the deepest mysteries and questions of life.
                    <br/>
                    Whether you want to overcome anger or understand the nature of God, whether you want to eradicate
                    jealousy or know whose company to keep, whether you want to recognise a true guru or develop faith
                    in God, the Vachanamrut can enlighten you. It is the essence of the Hindu scriptures based on the
                    spiritual knowledge, spiritual insight and practical experience of Bhagwan Swaminarayan, the Supreme
                    Reality Himself.`

    return (
        <>
            <div className="flex items-start">
                <div>
                    <Image
                        src={image}
                        alt={title}
                        width={200}
                        height={200}
                    />
                </div>
                <div className="flex flex-col pt-4 w-2/3">
                    <h3>
                        {title}
                    </h3>
                    <h4 className="text-gray-300 text-sm">
                        {type} {'•'} {author}
                    </h4>
                </div>
            </div>
            <div className="text-gray-400 max-h-32 overflow-auto">
                <p>
                    {content}
                </p>
            </div>
        </>
    )
}

function SectionTile() {
    const enabled = true
    const title = 'Gadhadha Pratham'
    const metadata = [
        '78 Sections',
        '1876-1877',
    ]
    const link = 'pratham'

    return (
        <Link
            href={link}
        >
            <div className="flex bg-gray-50 rounded-xl p-4 shadow-md">
                <div className="flex flex-col">
                    <h4>
                        {title}
                    </h4>
                    <div className="flex flex-row gap-1">
                        {metadata.map((item, index) => (
                            <p
                                className="text-gray-300 text-sm"
                                key={item + title}
                            >
                                {item} {index !== metadata.length - 1 && '•'}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default function Blog() {
    const posts = getAllPosts(["slug", "section_title", "section_number"]);

    return (
        <main
            className="container min-h-screen mx-auto p-4 flex flex-col max-w-lg gap-4"
        >
            <ContentPreviewInformation/>
            <SectionTile/>
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
    );
}