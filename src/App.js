import React, { Component } from "react";
import { getPaletteColors, getSingleColorShades } from "./colorHelpers";
import { Switch, Route, Redirect } from "react-router-dom";
import seedColors from "./seedColors";
import PaletteList from "./PaletteList";
import NewPalette from "./NewPalette";
import Palette from "./Palette";
import SingleColorPalette from "./SingleColorPalette";
import "./App.css";

class App extends Component {
  getPalette = (routeProps) => {
    const paletteData = getPaletteColors(routeProps.match.params.id);
    if (!paletteData) return <Redirect to="/page-not-found" />;
    return <Palette palette={paletteData} />;
  };

  getSingleColorPalette = (routeProps) => {
    const { paletteID, colorID } = routeProps.match.params;
    const { palette, singleColorShades } = getSingleColorShades(
      paletteID,
      colorID
    );
    if (!singleColorShades.length) return <Redirect to="/page-not-found" />;
    return (
      <SingleColorPalette
        palette={palette}
        shades={singleColorShades}
        {...routeProps}
      />
    );
  };

  render() {
    return (
      <div className="App">
        <Switch>
          <Route
            exact
            path="/"
            render={(routeProps) => (
              <PaletteList palettes={seedColors} {...routeProps} />
            )}
          />
          <Route exact path="/palette/:id" render={this.getPalette} />
          <Route
            exact
            path="/palette/:paletteID/:colorID"
            render={this.getSingleColorPalette}
          />
          <Route exact path="/new-palette" render={() => <NewPalette />} />
          <Route
            path="/page-not-found"
            render={() => <h1>Error 404: Page Not Found</h1>}
          />
        </Switch>
      </div>
    );
  }
}

export default App;
