import Document, { DocumentContext } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import sprite from 'svg-sprite-loader/runtime/sprite.build';

export default class MyDocument extends Document<any> {
  static async getInitialProps(context: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = context.renderPage;
    try {
      context.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(context);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
        spriteContent: sprite.stringify(),
      };
    } finally {
      sheet.seal();
    }
  }
}
