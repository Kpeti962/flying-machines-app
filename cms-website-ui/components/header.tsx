import Link from "next/link";

export default function Header() {
    return <header className="bg-slate-200">
        <div className="flex justify-between m-auto max-w-screen-lg p-5">
            <div>
                <Link href="/">Konor</Link>
            </div>
            <div>
                <ul className="flex gap-5">
                    <li><Link href="/flying-machines">Flying machines</Link></li>
                    <li><Link href="/contact">Contact</Link></li>
                </ul>
            </div>
        </div>
    </header>
}