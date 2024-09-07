import React from 'react'

// Dashboard
const HelloWorld = React.lazy(() => import('src/views/helloWorld/index'))

// Test Pages
const TestPage1 = React.lazy(() => import('src/views/helloWorld/testPage1/TestPage1'))
const TestPage2 = React.lazy(() => import('src/views/helloWorld/testPage2/TestPage2'))
const TestPage3 = React.lazy(() => import('src/views/helloWorld/testPage3/TestPage3'))
const TestPage4 = React.lazy(() => import('src/views/helloWorld/testPage4/TestPage4'))
const TestPage5 = React.lazy(() => import('src/views/helloWorld/testPage5/TestPage5'))
const TestPage6 = React.lazy(() => import('src/views/helloWorld/testPage6/TestPage6'))
const TestPage7 = React.lazy(() => import('src/views/helloWorld/testPage7/TestPage7'))
const TestPage8 = React.lazy(() => import('src/views/helloWorld/testPage8/TestPage8'))
const TestPage9 = React.lazy(() => import('src/views/helloWorld/testPage9/TestPage9'))
const TestPage10 = React.lazy(() => import('src/views/helloWorld/testPage10/TestPage10'))
const TestPage11 = React.lazy(() => import('src/views/helloWorld/testPage11/TestPage'))
const TestPage12 = React.lazy(() => import('src/views/helloWorld/testPage12/TestPage'))
const TestPage13 = React.lazy(() => import('src/views/helloWorld/testPage13/TestPage'))
const TestPage14 = React.lazy(() => import('src/views/helloWorld/testPage14/TestPage'))
const TestPage15 = React.lazy(() => import('src/views/helloWorld/testPage15/TestPage'))
const TestPage16 = React.lazy(() => import('src/views/helloWorld/testPage16/TestPage'))
const TestPage17 = React.lazy(() => import('src/views/helloWorld/testPage17/TestPage'))
const TestPage18 = React.lazy(() => import('src/views/helloWorld/testPage18/TestPage'))
const TestPage19 = React.lazy(() => import('src/views/helloWorld/testPage19/TestPage'))
const TestPage20 = React.lazy(() => import('src/views/helloWorld/testPage20/TestPage'))

const routes = [
  { path: '/helloWorld', name: 'Hello World', element: HelloWorld },

  // Test Pages
  { path: '/helloWorld/testPage1', name: 'Test Page 1', element: TestPage1 },
  { path: '/helloWorld/testPage2', name: 'Test Page 2', element: TestPage2 },
  { path: '/helloWorld/testPage3', name: 'Test Page 3', element: TestPage3 },
  { path: '/helloWorld/testPage4', name: 'Test Page 4', element: TestPage4 },
  { path: '/helloWorld/testPage5', name: 'Test Page 5', element: TestPage5 },
  { path: '/helloWorld/testPage6', name: 'Test Page 6', element: TestPage6 },
  { path: '/helloWorld/testPage7', name: 'Test Page 7', element: TestPage7 },
  { path: '/helloWorld/testPage8', name: 'Test Page 8', element: TestPage8 },
  { path: '/helloWorld/testPage9', name: 'Test Page 9', element: TestPage9 },
  { path: '/helloWorld/testPage10', name: 'Test Page 10', element: TestPage10 },
  { path: '/helloWorld/testPage11', name: 'Test Page 11', element: TestPage11 },
  { path: '/helloWorld/testPage12', name: 'Test Page 12', element: TestPage12 },
  { path: '/helloWorld/testPage13', name: 'Test Page 13', element: TestPage13 },
  { path: '/helloWorld/testPage14', name: 'Test Page 14', element: TestPage14 },
  { path: '/helloWorld/testPage15', name: 'Test Page 15', element: TestPage15 },
  { path: '/helloWorld/testPage16', name: 'Test Page 16', element: TestPage16 },
  { path: '/helloWorld/testPage17', name: 'Test Page 17', element: TestPage17 },
  { path: '/helloWorld/testPage18', name: 'Test Page 18', element: TestPage18 },
  { path: '/helloWorld/testPage19', name: 'Test Page 19', element: TestPage19 },
  { path: '/helloWorld/testPage20', name: 'Test Page 20', element: TestPage20 },
]

export default routes
