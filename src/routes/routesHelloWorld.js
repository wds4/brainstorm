import React from 'react'

// Dashboard
const HelloWorld = React.lazy(() => import('src/views/helloWorld/index'))

// Test Pages
const TestPage1 = React.lazy(() => import('src/views/helloWorld/testPage1/TestPage1'))
const TestPage2 = React.lazy(() => import('src/views/helloWorld/testPage2/TestPage2'))
const TestPage3 = React.lazy(() => import('src/views/helloWorld/testPage3/TestPage3'))
const TestPage4 = React.lazy(() => import('src/views/helloWorld/testPage4/TestPage4'))
const TestPage5 = React.lazy(() => import('src/views/helloWorld/testPage5/TestPage5'))

const routes = [
  { path: '/helloWorld', name: 'Hello World', element: HelloWorld },

  // Test Pages
  { path: '/helloWorld/testPage1', name: 'Test Page 1', element: TestPage1 },
  { path: '/helloWorld/testPage2', name: 'Test Page 2', element: TestPage2 },
  { path: '/helloWorld/testPage3', name: 'Test Page 3', element: TestPage3 },
  { path: '/helloWorld/testPage4', name: 'Test Page 4', element: TestPage4 },
  { path: '/helloWorld/testPage5', name: 'Test Page 5', element: TestPage5 },
]

export default routes
