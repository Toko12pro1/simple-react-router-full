import React from 'react'

export function usePath() {
  const [path, setPath] = React.useState(window.location.pathname)
  React.useEffect(() => {
    const handler = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [])
  return path
}

export function navigate(path: string) {
  if (path !== window.location.pathname) {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }
}

export const Link: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => {
  const onClick = (e: React.MouseEvent) => {
    e.preventDefault()
    navigate(href)
  }
  return <a href={href} onClick={onClick}>{children}</a>
}
