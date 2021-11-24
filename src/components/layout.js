import React from "react"
import Footer from "./footer"
import Header from "./header"

export default function Layout(props) {
  const { footer, children, header } = props

  return (
    <>
      {header ? <Header header={header} /> : null}
      <main>{children}</main>
      {footer ? <Footer footer={footer} /> : null}
    </>
  )
}
