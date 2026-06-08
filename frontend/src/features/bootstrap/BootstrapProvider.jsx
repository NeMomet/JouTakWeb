<<<<<<< HEAD
import { OpenFeatureProvider } from "@openfeature/react-sdk";
import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  getBootstrap,
  pickFeatureOverrideParams,
} from "../../services/api/bffApi";
import { AUTH_STATE_EVENT } from "../../services/auth/tokenStore";
import {
  initializeOpenFeature,
  updateFeatureConfiguration,
} from "../featureFlags/openFeature.js";
import { BootstrapContext } from "./bootstrapContext.js";

function RouteFallback() {
  return <div className="py-5 text-center text-secondary">Загрузка...</div>;
}

export function BootstrapProvider({ children, fallback = <RouteFallback /> }) {
  const [state, setState] = useState({
    bootstrap: null,
    loading: true,
    error: null,
  });
  const requestSeqRef = useRef(0);
  const mountedRef = useRef(false);

  const loadBootstrap = useCallback(async () => {
    const requestSeq = ++requestSeqRef.current;
    setState((current) => ({
      bootstrap: current.bootstrap,
      loading: true,
      error: null,
    }));

    try {
      const params = pickFeatureOverrideParams(window.location.search);
      const bootstrap = await getBootstrap(params);
      await updateFeatureConfiguration(bootstrap?.features || {});
      if (!mountedRef.current || requestSeq !== requestSeqRef.current) {
        return;
      }
      setState({
        bootstrap,
        loading: false,
        error: null,
      });
    } catch (error) {
      if (!mountedRef.current || requestSeq !== requestSeqRef.current) {
        return;
      }
      setState({
        bootstrap: null,
        loading: false,
        error,
      });
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    initializeOpenFeature();
    void loadBootstrap();

    const handleAuthStateChange = () => {
      void loadBootstrap();
    };
    window.addEventListener(AUTH_STATE_EVENT, handleAuthStateChange);

    return () => {
      mountedRef.current = false;
      window.removeEventListener(AUTH_STATE_EVENT, handleAuthStateChange);
    };
  }, [loadBootstrap]);

  const value = useMemo(
    () => ({
      ...state,
      reload: async () => {
        const requestSeq = ++requestSeqRef.current;
        setState((current) => ({
          bootstrap: current.bootstrap,
          loading: true,
          error: null,
        }));
        const params = pickFeatureOverrideParams(window.location.search);
        const bootstrap = await getBootstrap(params);
        await updateFeatureConfiguration(bootstrap?.features || {});
        if (!mountedRef.current || requestSeq !== requestSeqRef.current) {
          return bootstrap;
        }
        setState({
          bootstrap,
          loading: false,
          error: null,
        });
        return bootstrap;
      },
    }),
    [state],
  );

  if (state.loading && !state.bootstrap) {
    return fallback;
  }

  if (state.error && !state.bootstrap) {
    return (
      <div className="py-5 text-center text-danger">
        Не удалось загрузить конфигурацию интерфейса.
      </div>
    );
  }

  return (
    <OpenFeatureProvider>
      <BootstrapContext.Provider value={value}>
        {children}
      </BootstrapContext.Provider>
    </OpenFeatureProvider>
  );
}

BootstrapProvider.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
};
=======
import { OpenFeatureProvider } from "@openfeature/react-sdk";
import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  getBootstrap,
  pickFeatureOverrideParams,
} from "../../services/api/bffApi";
import { AUTH_STATE_EVENT } from "../../services/auth/tokenStore";
import {
  initializeOpenFeature,
  updateFeatureConfiguration,
} from "../featureFlags/openFeature.js";
import { BootstrapContext } from "./bootstrapContext.js";

const DEFAULT_BOOTSTRAP = {
  viewer: { is_authenticated: false },
  features: {},
  experiments: { anonymous_id_present: false },
  layout: { homepage_variant: "legacy" },
};

function getLocalFeatureOverrides(search) {
  const params = pickFeatureOverrideParams(search);
  const overrides = {};

  for (const [key, value] of params.entries()) {
    if (!key.startsWith("ff_")) {
      continue;
    }
    overrides[key.slice(3)] = value;
  }

  return overrides;
}

function buildFallbackBootstrap(search) {
  const features = getLocalFeatureOverrides(search);
  const homepageVariant = features.site_homepage_version || "legacy";

  return {
    ...DEFAULT_BOOTSTRAP,
    features,
    layout: { homepage_variant: homepageVariant },
  };
}

function RouteFallback() {
  return <div className="py-5 text-center text-secondary">Загрузка...</div>;
}

export function BootstrapProvider({ children, fallback = <RouteFallback /> }) {
  const [state, setState] = useState({
    bootstrap: null,
    loading: true,
    error: null,
  });
  const requestSeqRef = useRef(0);
  const mountedRef = useRef(false);

  const isCurrentRequest = useCallback(
    (requestSeq) => mountedRef.current && requestSeq === requestSeqRef.current,
    [],
  );

  const loadBootstrap = useCallback(async () => {
    const requestSeq = ++requestSeqRef.current;
    setState((current) => ({
      bootstrap: current.bootstrap,
      loading: true,
      error: null,
    }));

    try {
      const params = pickFeatureOverrideParams(window.location.search);
      const bootstrap = await getBootstrap(params);
      if (!isCurrentRequest(requestSeq)) {
        return;
      }
      await updateFeatureConfiguration(bootstrap?.features || {});
      if (!isCurrentRequest(requestSeq)) {
        return;
      }
      setState({
        bootstrap,
        loading: false,
        error: null,
      });
    } catch (error) {
      const fallbackBootstrap = buildFallbackBootstrap(window.location.search);
      if (!isCurrentRequest(requestSeq)) {
        return;
      }
      await updateFeatureConfiguration(fallbackBootstrap.features);
      if (!isCurrentRequest(requestSeq)) {
        return;
      }
      setState({
        bootstrap: fallbackBootstrap,
        loading: false,
        error,
      });
    }
  }, [isCurrentRequest]);

  useEffect(() => {
    mountedRef.current = true;
    initializeOpenFeature();
    void loadBootstrap();

    const handleAuthStateChange = () => {
      void loadBootstrap();
    };
    window.addEventListener(AUTH_STATE_EVENT, handleAuthStateChange);

    return () => {
      mountedRef.current = false;
      window.removeEventListener(AUTH_STATE_EVENT, handleAuthStateChange);
    };
  }, [loadBootstrap]);

  const value = useMemo(
    () => ({
      ...state,
      reload: async () => {
        const requestSeq = ++requestSeqRef.current;
        setState((current) => ({
          bootstrap: current.bootstrap,
          loading: true,
          error: null,
        }));
        const params = pickFeatureOverrideParams(window.location.search);
        const bootstrap = await getBootstrap(params);
        if (!isCurrentRequest(requestSeq)) {
          return bootstrap;
        }
        await updateFeatureConfiguration(bootstrap?.features || {});
        if (!isCurrentRequest(requestSeq)) {
          return bootstrap;
        }
        setState({
          bootstrap,
          loading: false,
          error: null,
        });
        return bootstrap;
      },
    }),
    [isCurrentRequest, state],
  );

  if (state.loading && !state.bootstrap) {
    return fallback;
  }

  return (
    <OpenFeatureProvider>
      <BootstrapContext.Provider value={value}>
        {children}
      </BootstrapContext.Provider>
    </OpenFeatureProvider>
  );
}

BootstrapProvider.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
};
>>>>>>> upstream
