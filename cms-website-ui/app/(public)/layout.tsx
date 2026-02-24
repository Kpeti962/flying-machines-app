import Footer from "@/components/footer";
import Header from "@/components/header";
import { ReactNode } from "react";

export default function Layout({children} : {children: ReactNode}) {
    return (
        <div>
            <Header />
            <main className="max-w-screen-lg m-auto">{children}</main>
            <Footer />
        </div>
    )
}