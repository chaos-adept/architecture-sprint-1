const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require('path');
const Dotenv = require('dotenv-webpack');

const deps = require("./package.json").dependencies;

const printCompilationMessage = require('./compilation.config.js');

module.exports = (_, argv) => ({
  output: {
    publicPath: "http://localhost:8081/",
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  devServer: {
    port: 8081,
    historyApiFallback: true,
    watchFiles: [path.resolve(__dirname, 'src')],
    onListening: function (devServer) {
      const port = devServer.server.address().port

      printCompilationMessage('compiling', port)

      devServer.compiler.hooks.done.tap('OutputMessagePlugin', (stats) => {
        setImmediate(() => {
          if (stats.hasErrors()) {
            printCompilationMessage('failure', port)
          } else {
            printCompilationMessage('success', port)
          }
        })
      })
    }
  },

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.svg/,
        type: 'asset/resource'
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "frontend",
      filename: "remoteEntry.js",
      remotes: {
        'auth_microfrontend': 'auth_microfrontend@http://localhost:8082/remoteEntry.js',
        'profile_microfrontend': 'profile_microfrontend@http://localhost:8083/remoteEntry.js',
        'cards_microfrontend': 'cards_microfrontend@http://localhost:8084/remoteEntry.js'
      },
      exposes: {

      },
      shared: {
        ...deps,
        react: {
          eager: true,
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          eager: true,
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
        "react-router": {
          eager: true,
          singleton: true,
          requiredVersion: deps["react-router"],
        },
        "react-router-dom": {
          eager: true,
          singleton: true,
          requiredVersion: deps["react-router-dom"],
        }
      },
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
    new Dotenv()
  ],
});
