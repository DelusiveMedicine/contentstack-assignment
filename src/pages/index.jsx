import React, { useEffect, useState } from "react";
import API from "../sdk/entry";

import Book from "./book";
import Layout from "../components/layout";

function Home(props) {
  const { history, location: { state: { pageNum: page_num = 1 } = {} } } = props

  const [pageNum, setPageNum] = useState(page_num)
  const [entryCount, setEntryCount] = useState(0)
  const [entry, setEntry] = useState()
  const [error, setError] = useState({ errorStatus: false, errorCode: undefined, errorData: undefined })

  const bookLimit = 5

  useEffect(async () => {
    // try {
    //   const [books, bookCount] = await Stack.getEntry(
    //     "book_page"
    //   );

    //   setEntry(books)
    //   setEntryCount(bookCount)
    //   setError(prevState => ({...prevState, errorStatus: false }))

    // } catch (error) {
    //   setError({ errorStatus: true, errorCode: 404, errorData: error })
    // }

    try {
      const { data: { all_book_page: { items, total } } } = await API.getAllBooks((pageNum - 1) * bookLimit)

      setEntry(items)
      setEntryCount(Number(total))
    } catch (error) {
        setError({ errorStatus: true, errorCode: 404, errorData: error })
      }
  }, [pageNum])

  async function incrementHandler() {
    try {
      const { data: { all_book_page: { items } } } = await API.getAllBooks(pageNum * bookLimit)

      setPageNum(pageNum + 1)
      setEntry(items)
      setError(prevState => ({...prevState, errorStatus: false }))
      } catch (error) {
        setError({ errorStatus: true, errorCode: 404, errorData: error })
      }
  }

  async function decrementHandler() {
    const prevPageNum = Math.max(1, pageNum - 1)

    try {
      const { data: { all_book_page: { items } } } = await API.getAllBooks((prevPageNum - 1) * bookLimit)

      setPageNum(prevPageNum)
      setEntry(items)
      setError(prevState => ({...prevState, errorStatus: false }))
      } catch (error) {
        setError({ errorStatus: true, errorCode: 404, errorData: error })
      }
  }

  if (!error.errorStatus) {

    if(!entry) {
      return (
        <div>Loading...</div>
      )
    }

    return (
      <Layout>
        <ul style={{ listStyle: 'none' }}>
          {entry?.map(({ book_data, url, system: { uid } }) => {
            const bookData = {...book_data, uid, pageNum, book_cover: book_data.book_coverConnection.edges[0].node}

            return (
              <li key={book_data.book_title}>
                <Book {...bookData} url={url} />
              </li>
            )
          })}
        </ul>
        <div style={{ width: 300, padding: 50, margin: "0 auto", display: 'flex' }}>
          <button onClick={decrementHandler} style={{ flexBasis: '50%' }} disabled={pageNum === 1}>Previous</button>
          <button 
            onClick={incrementHandler} 
            style={{ flexBasis: '50%' }} 
            disabled={entryCount - (pageNum * bookLimit) <= 0}
          >
            Next
          </button>
        </div>
      </Layout>
    );
  }

  if (error.errorStatus) {
    history.push("/error", [error]);
  }
  return "";
}
export default Home;
