import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom"

import API from "../sdk/entry";

export default function BookDetails() {
    const { pathname, state: { pageNum } = {} } = useLocation()

    const [bookData, setBookData] = useState()
    const [error, setError] = useState({ errorStatus: false, errorCode: undefined, errorData: undefined })

    useEffect(async () => {
        try {
            const [{ book_data }] = await API.getEntryByUrl('book_page', pathname)

            setBookData(book_data)
        } catch (error) {
            setError({ errorStatus: true, errorCode: 404, errorData: error })
        }
    }, [])

    if (error.errorStatus) {
        return <div>Something went wrong</div>
    }

    if (!bookData) {
        return <div>Loading...</div>
    }

    const { amazon_link, book_author, book_cover, book_description, book_pages, book_title } = bookData

    return (
        <>
            <div className="btn-wrapper">
                <Link to={{ pathname: "/", state: { pageNum } }} className="btn primary-btn">Back</Link>
            </div>
            <div style={{ margin: "0 auto", width: "80%", display: "flex", flexDirection: "column" }}>
                <h1>{book_title}</h1>         
                <div style={{ display: "flex" }}>
                    <div style={{ display: "flex", flexDirection: "column", paddingRight: 50 }}>
                        <img src={book_cover.url} alt={book_title} width={250} />
                        <span>Author(s): {book_author}</span>
                        <span>{book_pages} pages</span>
                    </div>
                    <div style={{ flexBasis: "30%" }}>
                        <p>{book_description}</p>
                        <a href={amazon_link.href}>Buy this book on Amazon</a>
                    </div>
                </div>
            </div>
        </>
    )
}