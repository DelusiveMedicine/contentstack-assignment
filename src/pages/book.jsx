import React from "react";
import { Link } from "react-router-dom";

export default function Book(props) {
    const {amazon_link, book_author, book_cover, book_description, book_pages, book_title, pageNum, url} = props

    return (
        <div style={{ display: 'flex', marginBottom: 50 }}>            
            <div className='cards'>
                <Link to={{ pathname: url, state: { pageNum } }}>
                    <img src={book_cover.url} alt={book_title} width={100} />
                    <h3>{book_title}</h3>
                </Link>
                <span>Author(s): {book_author}</span>
                <span style={{ marginBottom: 20 }}>{book_pages} pages</span>
                <a href={amazon_link.href}>Buy this book on Amazon</a>
            </div>
            <p className='cards'>{book_description}</p>
        </div>
    )
}