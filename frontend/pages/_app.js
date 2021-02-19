/* eslint-disable react/jsx-props-no-spreading */
import Page from '../components/Page';

export default function myApp({ Component, pageProps }) {
  return (
    <Page>
      {/* Component prop is the active page. pageProps is an object with the initial props */}
      <Component {...pageProps} />
    </Page>
  );
}
