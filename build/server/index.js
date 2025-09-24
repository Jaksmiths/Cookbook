import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts, Link, UNSAFE_withHydrateFallbackProps } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useState, useRef, useEffect } from "react";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
const home = UNSAFE_withComponentProps(function Contact() {
  return /* @__PURE__ */ jsxs("main", {
    children: [/* @__PURE__ */ jsx("h1", {
      children: "Hello, welcome to my website."
    }), /* @__PURE__ */ jsx(Link, {
      to: "/dog",
      children: "Dog Generator"
    }), /* @__PURE__ */ jsx(Link, {
      to: "/cookbook",
      children: "Cookbook"
    })]
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home
}, Symbol.toStringTag, { value: "Module" }));
function meta({}) {
  return [{
    title: "New React Router App"
  }, {
    name: "description",
    content: "Welcome to React Router!"
  }];
}
const HydrateFallback = UNSAFE_withHydrateFallbackProps(function HydrateFallback2() {
  return /* @__PURE__ */ jsx("div", {
    children: "Loading..."
  });
});
async function clientLoader$1({}) {
  const res = await fetch(`https://dog.ceo/api/breeds/image/random`);
  const product = await res.json();
  return product;
}
const dog = UNSAFE_withComponentProps(function Home({
  loaderData
}) {
  const {
    message,
    status
  } = loaderData;
  console.log(message);
  console.log(status);
  return /* @__PURE__ */ jsx("img", {
    src: message
  });
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HydrateFallback,
  clientLoader: clientLoader$1,
  default: dog,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const RecipeCard = ({ recipe: recipe2 }) => {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("div", { children: recipe2.name }),
    /* @__PURE__ */ jsxs("div", { children: [
      "Serving Size: ",
      recipe2.serv,
      " ",
      recipe2.servUnit
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      "Total Time: ",
      recipe2.time,
      " ",
      recipe2.timeUnit
    ] })
  ] });
};
const WithIntersectionObserver = ({
  recipes,
  fetchData,
  error,
  loading
}) => {
  const [page, setPage] = useState(0);
  const observerTarget = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => {
            const nextPage = prevPage + 1;
            fetchData(nextPage);
            return nextPage;
          });
        }
      },
      { threshold: 1 }
    );
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { children: recipes.map((recipe2) => /* @__PURE__ */ jsx(RecipeCard, { recipe: recipe2 }, recipe2.id)) }),
    /* @__PURE__ */ jsx("div", { ref: observerTarget }),
    loading && /* @__PURE__ */ jsx("p", { children: "Loading..." }),
    error && /* @__PURE__ */ jsxs("p", { children: [
      "Error: ",
      error.message
    ] })
  ] });
};
const cookbook = UNSAFE_withComponentProps(function Cookbook() {
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const fetchData = async (page) => {
    try {
      setLoading(true);
      const result = await fetch(`http://localhost:9000/cookbook/?limit=10&skip=${(page - 1) * 10}`);
      const data = await result.json();
      if (result.ok) {
        setRecipes((prevRecipes) => [...prevRecipes, ...data.rec]);
      }
      console.log(`fetch &skip=${(page - 1) * 10}`);
      setLoading(false);
    } catch (error2) {
      setLoading(false);
      if (error2 instanceof Error) {
        setError(error2);
      }
    }
  };
  useEffect(() => {
    let subscribed = true;
    (async () => {
      if (subscribed) {
        await fetchData(1);
      }
    })();
    return () => {
      subscribed = false;
    };
  }, []);
  return /* @__PURE__ */ jsx("div", {
    children: /* @__PURE__ */ jsx(WithIntersectionObserver, {
      recipes,
      fetchData,
      loading,
      error
    })
  });
});
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: cookbook
}, Symbol.toStringTag, { value: "Module" }));
async function clientLoader({
  params
}) {
  const res = await fetch(`http://localhost:9000/recipe/` + params.recipeId);
  const recipe2 = await res.json();
  return recipe2;
}
const recipe = UNSAFE_withComponentProps(function Recipe({
  loaderData
}) {
  const {
    rec,
    ing,
    ins
  } = loaderData;
  console.log(rec);
  console.log(ing);
  console.log(ins);
  return /* @__PURE__ */ jsx("main", {
    children: /* @__PURE__ */ jsxs("div", {
      className: "grid grid-flow-col grid-rows-3 gap-4 m-4",
      children: [/* @__PURE__ */ jsx("div", {
        className: "col-span-2 row-start-1",
        children: /* @__PURE__ */ jsxs("ul", {
          children: [/* @__PURE__ */ jsx("li", {
            className: "text-2xl",
            children: rec[0].name
          }, "name"), /* @__PURE__ */ jsxs("li", {
            children: ["Serving Size: ", rec[0].serv, " ", rec[0].servUnit]
          }, "serv"), /* @__PURE__ */ jsxs("li", {
            children: ["Total Time: ", rec[0].time, " ", rec[0].timeUnit]
          }, "time")]
        })
      }), /* @__PURE__ */ jsx("div", {
        className: "row-span-3 col-start-1",
        children: /* @__PURE__ */ jsx("ul", {
          children: ing.map((item) => /* @__PURE__ */ jsxs("li", {
            children: [item.ingredient, " ", item.qty, " ", item.qtyUnit]
          }, item.ingredient))
        })
      }), /* @__PURE__ */ jsx("div", {
        className: "col-span-2 row-span-2",
        children: /* @__PURE__ */ jsx("ul", {
          children: ins.map((item) => /* @__PURE__ */ jsx("li", {
            className: "mt-3",
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex",
              children: [/* @__PURE__ */ jsx("div", {
                className: "w-14 flex-none",
                children: item.step
              }), /* @__PURE__ */ jsx("div", {
                className: "w-64 flex-1",
                children: item.instruct
              })]
            })
          }, item.step + "_instr"))
        })
      })]
    })
  });
});
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  clientLoader,
  default: recipe
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-Bwiso8iI.js", "imports": ["/assets/chunk-UH6JLGW7-2ts3TPiB.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-D4azEzza.js", "imports": ["/assets/chunk-UH6JLGW7-2ts3TPiB.js"], "css": ["/assets/root-B-0nqU1a.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-xxp9Sb_X.js", "imports": ["/assets/chunk-UH6JLGW7-2ts3TPiB.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/dog": { "id": "routes/dog", "parentId": "root", "path": "dog", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": true, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/dog-BOIkCqlr.js", "imports": ["/assets/chunk-UH6JLGW7-2ts3TPiB.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/cookbook": { "id": "routes/cookbook", "parentId": "root", "path": "cookbook", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/cookbook-CX7JWgkU.js", "imports": ["/assets/chunk-UH6JLGW7-2ts3TPiB.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/recipe": { "id": "routes/recipe", "parentId": "root", "path": "cookbook/:recipeId", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": true, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/recipe-CtydY8NH.js", "imports": ["/assets/chunk-UH6JLGW7-2ts3TPiB.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-8a0b931f.js", "version": "8a0b931f", "sri": void 0 };
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "unstable_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/dog": {
    id: "routes/dog",
    parentId: "root",
    path: "dog",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/cookbook": {
    id: "routes/cookbook",
    parentId: "root",
    path: "cookbook",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/recipe": {
    id: "routes/recipe",
    parentId: "root",
    path: "cookbook/:recipeId",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
