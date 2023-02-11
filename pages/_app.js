import '../styles/globals.css'
import React, { useEffect } from 'react';
import { SnackbarProvider } from "notistack";
import { ThemeProvider } from "@material-ui/styles";
import { LayoutProvider } from "../utils/LayoutContext";
import Themes from "../themes";
import Head from 'next/head';
import { DataStoreProvider } from '../utils/DataStore';


export default function MyApp({ Component, pageProps }) {

  return (
    <>
      <Head>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/3.6.0/mdb.min.css"
          rel="stylesheet"
        />
       
      </Head>
      <DataStoreProvider>
        <LayoutProvider>
          <ThemeProvider theme={Themes.default}>
            <SnackbarProvider
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Component {...pageProps} />
            </SnackbarProvider>
          </ThemeProvider>
        </LayoutProvider>
      </DataStoreProvider>
    </>
  )
}

