'use client'
import {History, Settings} from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";


function Header() {
    const greeting = () => {
        if (new Date().getHours() < 12) {
            return 'Good Morning'
        } else if (new Date().getHours() < 18) {
            return 'Good Afternoon'

        } else {
            return 'Good Evening'
        }
    }

    return (
        <div className="flex justify-between w-full">
            <h3
                className="text-3xl font-bold text-gray-800"
            >
                {greeting()}
            </h3>
            <div className="flex items-center gap-2">
                <History/>
                <Settings/>
            </div>
        </div>
    )
}

function Tile() {
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
    const link = 'vach'
    const tags = ['Hinduism', 'Spirituality', 'Bhagwan Swaminarayan']


    return (
        <Link
            href={link}
        >
            <div className="flex flex-col items-center justify-center w-full bg-white rounded-2xl shadow-md p-4">
                <Image
                    src={image}
                    alt={title}
                    width={200}
                    height={200}
                />
                <div className="flex flex-col w-full">
                    <h3>
                        {title}
                    </h3>
                    <h4 className="text-gray-300 text-md">
                        {type} {'•'} {author}
                    </h4>
                </div>
                <div className="max-h-32 overflow-auto">
                    <p className="text-gray-300">
                        {content}
                    </p>
                </div>
                <div className="flex flex-wrap gap-2 py-2">
                    {tags.map((tag) => (
                        <div
                            className="bg-[#9BFA8B] rounded-md px-2 py-1"
                            key={tag}
                        >
                            {tag}
                        </div>
                    ))}
                </div>
            </div>
        </Link>
    )
}

export default function Home() {

    return (
        <main
            className="container min-h-screen mx-auto p-4 flex flex-col max-w-lg gap-4"
        >
            <Header/>
            <Tile/>
        </main>
    );
}