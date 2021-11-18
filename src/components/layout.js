import React from "react"
import Footer from "./footer"

export default function Layout(props) {
  const { footer, children } = props

  return (
    <>
      <main>{children}</main>
      {footer ? <Footer footer={footer} /> : ""}
    </>
  )
}
