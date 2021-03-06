import React from 'react';
import App, { Container } from 'next/app';

// Required by: https://github.com/zeit/next.js/issues/5291
// This file (_app.js) and test.css can be removed when the issue is resolved
import './test.css';

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    );
  }
}
