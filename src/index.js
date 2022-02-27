import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import ReactDOM from "react-dom";
import App from "./App";
import 'bootstrap/dist/css/bootstrap.min.css';

const link = createHttpLink({
    uri: '/api/graphql',
    credentials: 'same-origin'
});

const client = new ApolloClient({
    link: link,
    cache: new InMemoryCache()
});

const app = document.getElementById("app");
ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
    , app);