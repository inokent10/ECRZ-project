import { BrowserRouter, Route, Routes } from "react-router-dom";
import { JSX } from "react";

import CatalogPage from "../../pages/catalog-page";

import { AppRoute } from "../const";

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={AppRoute.Home} element={<CatalogPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
