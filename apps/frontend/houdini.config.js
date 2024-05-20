/// <references types="houdini-svelte">

/** @type {import('houdini').ConfigFile} */
const config = {
  watchSchema: {
    url: "http://localhost:4000/graphql",
  },
  plugins: {
    "houdini-svelte": {
      static: true,
    },
  },
}

export default config
