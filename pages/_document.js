import * as React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="kor">
        <Head>
          {/* Global Site Tag (gtag.js) - Google Analytics */}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${process.env.NEXT_PUBLIC_GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />
          <meta name="description" content="오늘은 우리 함께해요, toGather" />
          <meta
            name="keywords"
            content="오늘, 오늘 뭐하지, 퇴근, 퇴근 후, 살롱, 모임, 소개팅, 번개모임, 번개, 사람, 맛집 같이 갈 사람"
          />
          <meta property="og:url" content="togather.kr" />
          <meta property="og:type" content="website" />
          <meta
            property="og:image"
            content="https://res.cloudinary.com/valuers/image/upload/v1644317739/toGather_c9iv3x.png"
          />
          <meta property="og:title" content="Valuers" />
          <meta
            property="og:description"
            content="오늘은 우리 함께해요, toGather"
          />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
