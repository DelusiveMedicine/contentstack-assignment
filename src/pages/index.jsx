import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { useLocation } from "react-router-dom"
import { Redirect } from "react-router";

import API from "../sdk/entry";
import { getImageData } from "../utils/helpers";

import Book from "./book";
import Layout from "../components/layout";

function Home() {
  const bookLimit = 5
  // const { history, location: { state: { pageNum: page_num = 1 } = {} } } = props
  const { state: { pageNum: page_num = 1 } = {} } = useLocation()

  const [pageNum, setPageNum] = useState(page_num)
  const [entry, setEntry] = useState([])
  // const [error, setError] = useState({ errorStatus: false, errorCode: undefined, errorData: undefined })

  const { data: { all_header: { items: [header] = [{}] } = {}, all_book_page: { items = [], total = 0 } = {} } = {}, refetch, loading, error } = useQuery(API.homeDataQuery, {
    variables: {
      limit: bookLimit,
      skip: (pageNum - 1) * bookLimit
    }
  })

  const logo = header.logoConnection ? getImageData(header.logoConnection) : {}

  useEffect(() => {
    if(items.length) {
      setEntry(items)
    }
  }, [items])

  // useEffect(async () => {
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

  //   try {
  //     const { data: { all_book_page: { items, total } } } = await API.getAllBooks((pageNum - 1) * bookLimit)

  //     setEntry(items)
  //     setEntryCount(Number(total))
  //   } catch (error) {
  //       setError({ errorStatus: true, errorCode: 404, errorData: error })
  //     }
  // }, [pageNum])

  function incrementHandler() {
    // try {
    //   const { data: { all_book_page: { items } } } = await API.getAllBooks(pageNum * bookLimit)

    //   setPageNum(pageNum + 1)
    //   setEntry(items)
    //   setError(prevState => ({...prevState, errorStatus: false }))
    //   } catch (error) {
    //     setError({ errorStatus: true, errorCode: 404, errorData: error })
    //   }
    setPageNum(pageNum + 1)
    refetch({
      skip: pageNum * bookLimit
    })
  }

  function decrementHandler() {
    const prevPageNum = Math.max(1, pageNum - 1)

    // try {
    //   const { data: { all_book_page: { items } } } = await API.getAllBooks((prevPageNum - 1) * bookLimit)

    //   setPageNum(prevPageNum)
    //   setEntry(items)
    //   setError(prevState => ({...prevState, errorStatus: false }))
    //   } catch (error) {
    //     setError({ errorStatus: true, errorCode: 404, errorData: error })
    //   }

    // setPageNum(prevPageNum)
    // refetch({
    //   skip: (prevPageNum - 1) * bookLimit
    // })

    // console.log(previousData);
    // const { all_book_page: { items } } = previousData

    // setEntry(items)


    setPageNum(prevPageNum)
    refetch({
      skip: (prevPageNum - 1) * bookLimit
    })
  }

  if(loading) {
    return (
      <div>Loading...</div>
    )
  }

  if (error) {
    return <Redirect to={'/error'} />
  }

  return (
    <Layout header={{...header, logo}}>
      <ul style={{ listStyle: 'none' }}>
        {entry?.map(({ book_data, url, system: { uid } }) => {
          const bookCover = getImageData(book_data.book_coverConnection)

          const bookData = {...book_data, uid, pageNum, book_cover: bookCover}

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
          disabled={total - (pageNum * bookLimit) <= 0}
        >
          Next
        </button>
      </div>
    </Layout>
  );
}
export default Home;
