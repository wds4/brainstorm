import React, { useCallback, useState } from 'react'
import { useLocation } from 'react-router-dom'

import routes from '../routes'

import { CBreadcrumb, CBreadcrumbItem, CFormSwitch } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { updateShowListenerManagerMode } from '../redux/features/settings/slice'

const ShowListenerSwitchOrNot = () => {
  const currentDevelopmentMode = useSelector((state) => state.settings.general.developmentMode)

  const dispateh = useDispatch()

  const [showListenerManageraButton, setShowListenerManageraButton] = useState('hide')
  const toggleShowListenerManager = useCallback(
    (e) => {
      if (showListenerManageraButton == 'hide') {
        setShowListenerManageraButton('show')
        dispateh(updateShowListenerManagerMode('show'))
      }
      if (showListenerManageraButton == 'show') {
        setShowListenerManageraButton('hide')
        dispateh(updateShowListenerManagerMode('hide'))
      }
    },
    [showListenerManageraButton],
  )
  if (currentDevelopmentMode == 'hide') {
    return <></>
  }
  if (currentDevelopmentMode == 'show') {
    return (
      <CFormSwitch
        onChange={(e) => toggleShowListenerManager(e)}
        label="listener manager"
        id="formSwitchCheckDefault"
      />
    )
  }
  return <></>
}

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname

  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => route.path === pathname)
    return currentRoute ? currentRoute.name : false
  }

  const getBreadcrumbs = (location) => {
    const breadcrumbs = []
    location.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`
      const routeName = getRouteName(currentPathname, routes)
      routeName &&
        breadcrumbs.push({
          pathname: '/#' + currentPathname,
          name: routeName,
          active: index + 1 === array.length ? true : false,
        })
      return currentPathname
    })
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ flexGrow: '1' }}>
          <CBreadcrumb className="my-0">
            <CBreadcrumbItem href="/">Home</CBreadcrumbItem>
            {breadcrumbs.map((breadcrumb, index) => {
              return (
                <CBreadcrumbItem
                  {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
                  key={index}
                >
                  {breadcrumb.name}
                </CBreadcrumbItem>
              )
            })}
          </CBreadcrumb>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <ShowListenerSwitchOrNot />
      </div>
    </>
  )
}

export default React.memo(AppBreadcrumb)
