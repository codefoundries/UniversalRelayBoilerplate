// @flow

// In order to use ES7 async/await
import 'babel-polyfill'

import BrowserProtocol from 'farce/lib/BrowserProtocol'
import createInitialFarceRouter from 'found/lib/createInitialFarceRouter'
import createRender from 'found/lib/createRender'
import React from 'react'
import ReactDOM from 'react-dom'

import getGraphQLServerURL from '../_configuration/rb-appbase-webapp/getGraphQLServerURL'
import AppWrapper from '../_configuration/rb-appbase-webapp/AppWrapper'

import FetcherClient from './fetcherClient'
import { createResolver, historyMiddlewares, routeConfig } from './router'

// Include global CSS used in all units. Will not be chunked
import '../_configuration/rb-appbase-webapp/global.css'

const render = createRender({})

  //
;( async() => {
  const { relayPayloads, siteConfiguration } = window.__rebar_properties__

  // eslint-disable-next-line no-underscore-dangle
  const fetcher = new FetcherClient(
    getGraphQLServerURL(),
    relayPayloads,
    relayPayloads[0].data.Viewer.UserToken2, // It is critical that the app frame has UserToken2 retrieved
  )
  const resolver = createResolver( fetcher )

  const Router = await createInitialFarceRouter({
    historyProtocol: new BrowserProtocol(),
    historyMiddlewares,
    routeConfig: routeConfig( siteConfiguration ),
    resolver,
    render,
  })

  const contentComponent = (
    <AppWrapper siteConfiguration={siteConfiguration} url={document.location.href}>
      <Router resolver={resolver} />
    </AppWrapper>
  )

  ReactDOM.hydrate(
    contentComponent,
    // $AssureFlow
    document.getElementById( 'root' ),
    () => {
      // TODO [2 Crossroads][Designer][webapp] Research if removal of styles if necessary
      // Previous version of react required removing of JSS styles but the new one seems to handle
      // them OK.
      // // We don't need the static css any more once we have launched our application.
      // const ssStyles = document.getElementById( 'server-side-styles' )
      // ssStyles.parentNode.removeChild( ssStyles )
    },
  )
})()
