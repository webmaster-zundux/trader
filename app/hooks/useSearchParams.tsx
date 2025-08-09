import { useCallback, useEffect, useRef } from 'react'
import { useSearchParams as reactRouterUseSeachParamsHook, type SetURLSearchParams, type URLSearchParamsInit } from 'react-router'

/**
 * Wraps useSearchParams() from "react-router" package
 * BUT provides setUrlSearchParams() function that does NOT changes after each a component render
 */
export function useSearchParams(defaultInit?: URLSearchParamsInit | undefined) {
  const setUrlSearchParamsRef = useRef<SetURLSearchParams>(undefined)
  const [urlSearchParams, reactRouterSetUrlSearchParams] = reactRouterUseSeachParamsHook(defaultInit)

  useEffect(function updateReactRouterSetUrlSearchParamsFunctionEffect() {
    setUrlSearchParamsRef.current = reactRouterSetUrlSearchParams
  }, [setUrlSearchParamsRef, reactRouterSetUrlSearchParams])

  const setUrlSearchParams: SetURLSearchParams = useCallback(function setUrlSearchParams(nextInit, navigateOpts) {
    const reactRouterSetUrlSearchParamsFromRef = setUrlSearchParamsRef.current

    if (typeof reactRouterSetUrlSearchParamsFromRef !== 'function') {
      return
    }

    const currentUrlSearchParams = new URLSearchParams(window.location.search)
    const currentUrlSearchParamsString = currentUrlSearchParams.toString()
    const nextInitString = (typeof nextInit === 'function') ? nextInit(currentUrlSearchParams).toString() : nextInit?.toString()
    const isUrlSearchParamsTheSame = nextInitString === currentUrlSearchParamsString

    const overridedNavigateOptions: typeof navigateOpts = {
      ...navigateOpts,
      replace: isUrlSearchParamsTheSame,
    }

    reactRouterSetUrlSearchParamsFromRef(nextInit, overridedNavigateOptions)
  }, [setUrlSearchParamsRef])

  return {
    urlSearchParams,
    setUrlSearchParams,
  }
}
