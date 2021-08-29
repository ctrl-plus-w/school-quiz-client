import React from 'react';
import Document from 'next/document';

import { Html, Head, Main, NextScript } from 'next/document';

import type { DocumentContext, DocumentInitialProps } from 'next/document';
import type { ReactElement } from 'react';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render(): ReactElement {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
